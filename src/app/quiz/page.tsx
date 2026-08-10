"use client";
import { useEffect, useState } from "react";
import Header from "../../components/Siswa/Header";
import Sidebar from "../../components/Siswa/Sidebar";
import { supabase } from "../../lib/supabase";
interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}
const letters = ["A", "B", "C", "D"];
export default function QuizPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // PINDAHKAN KE SINI
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    getSoal();
  }, []);

useEffect(() => {
  const endTime = localStorage.getItem("quizCooldown");
  const finishedStatus = localStorage.getItem("quizFinished");

  if (finishedStatus === "true") {
    setFinished(true);
  }

  if (!endTime) return;

  const remaining = Math.max(
    0,
    Math.floor((Number(endTime) - Date.now()) / 1000)
  );

  if (remaining > 0) {
    setCooldown(remaining);
  } else {
    localStorage.removeItem("quizCooldown");
    localStorage.removeItem("quizFinished");
  }
}, []);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
if (prev <= 1) {
  localStorage.removeItem("quizCooldown");
  localStorage.removeItem("quizFinished");
  clearInterval(timer);
  return 0;
}

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const getSoal = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("soal")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      const hasil: Question[] = data.map((item) => ({
        id: item.id,
        question: item.pertanyaan,
        options: [
          item.opsi_a,
          item.opsi_b,
          item.opsi_c,
          item.opsi_d,
        ],
        correct: item.jawaban,
      }));

      const randomQuestions = hasil
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

      setQuizData(randomQuestions);
    } catch (err) {
      console.log("Gagal mengambil soal", err);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (quizData.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-gray-500">
          Belum ada soal quiz.
        </p>
      </div>
    );
  }


  const current = quizData[currentIndex];
  const isLast =
    currentIndex === quizData.length - 1;
const handleNext = () => {
  if (selected === null) return;

  const newAnswers = [...answers, selected];
  setAnswers(newAnswers);

  if (isLast) {
    const endTime = Date.now() + 5 * 60 * 1000;

    localStorage.setItem("quizCooldown", String(endTime));
    localStorage.setItem("quizFinished", "true");

    setCooldown(5 * 60);

    // Tunggu state answers diperbarui
    setTimeout(() => {
      setFinished(true);
    }, 0);
  } else {
    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
  }
};
  const correctCount = answers.filter(
    (answer, index) =>
      answer === quizData[index].correct
  ).length;
  const score = Math.round(
    (correctCount / quizData.length) * 100
  );
  if (showReview) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="md:ml-64 flex flex-col min-h-screen">
            <div className="md:hidden">
    <Header
      setIsSidebarOpen={setIsSidebarOpen}
    />
  </div>
          <div className="flex-1 p-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Review Jawaban
              </h2>
              <div className="space-y-5">
                {quizData.map((q, i) => {
                  return (
                    <div
  key={q.id}
  className="bg-white rounded-xl shadow-md border border-slate-200 p-5"
>
<div className="flex justify-between items-start mb-4">
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
      {i + 1}
    </div>
    <h2 className="font-semibold text-slate-800 text-sm">
      Soal {i + 1}
    </h2>
  </div>
  {answers[i] === q.correct ? (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">
      Jawaban Benar
    </div>
  ) : (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">
      Jawaban Salah
    </div>
  )}
</div>
<div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 mb-3">
  <p className="text-slate-700 text-[13px] leading-6">
    {q.question}
  </p>
</div>
                      <div className="space-y-3">
                        {q.options.map(
                          (option, idx) => {
                            const isCorrect =
                              idx === q.correct;
                            const isSelected =
                              answers[i] === idx;
                            let color =
                              "border-slate-200";
                            if (isCorrect) {
                              color =
                                "border-green-500 bg-green-50";
                            }
                            if (
                              isSelected &&
                              !isCorrect
                            ) {
                              color =
                                "border-red-500 bg-red-50";
                            }
                            return (
                                                            <div
                                key={idx}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-200 text-slate-700 text-left ${color}`}
                              >
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                                    isCorrect
                                      ? "bg-green-600 text-white"
                                      : isSelected
                                      ? "bg-red-600 text-white"
                                      : "bg-slate-200 text-slate-700"
                                  }`}
                                >
                                  {letters[idx]}
                                </div>
                                <span className="text-[13px] font-medium">
                                  {option}
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setShowReview(false)}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
              >
                Kembali ke Hasil Quiz
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  if (finished) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="md:ml-64 flex flex-col min-h-screen">
          <Header
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <div className="flex-1 flex items-center justify-center p-5">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
                  🎉
                </div>
              </div>
              <h1 className="text-2xl font-bold text-center text-slate-800 mt-4">
                Quiz Selesai
              </h1>
                            <p className="text-center text-slate-500 text-sm mt-2">
                Selamat! Kamu telah menyelesaikan quiz.
              </p>
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                  Nilai Kamu
                </p>
                <h2 className="text-5xl font-bold text-blue-600 mt-2">
                  {score}
                </h2>
                <p className="text-xs text-slate-400 mt-2">
                  dari 100 poin
                </p>
              </div>
              <button
                onClick={() => setShowReview(true)}
                className="w-full mt-6 border border-blue-600 text-blue-600 hover:bg-blue-50 transition py-2.5 rounded-lg text-sm font-semibold"
              >
                Lihat Review Jawaban
              </button>
<button
  disabled={cooldown > 0}
onClick={() => {
  if (cooldown > 0) return;

  localStorage.removeItem("quizCooldown");
  localStorage.removeItem("quizFinished");

  setCurrentIndex(0);
  setAnswers([]);
  setSelected(null);
  setFinished(false);
  setShowReview(false);

  setQuizData((prev) =>
    [...prev].sort(() => Math.random() - 0.5)
  );
}}
  className="w-full mt-3 bg-blue-600 hover:bg-blue-700 transition text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
>
  {cooldown > 0
    ? `Ulangi dalam ${Math.floor(cooldown / 60)}:${String(
        cooldown % 60
      ).padStart(2, "0")}`
    : "Ulangi Quiz"}
</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="md:ml-64 flex flex-col min-h-screen">
        <Header
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 p-5">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 p-5">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {currentIndex + 1}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 text-sm">
                    Pertanyaan Quiz
                  </h2>
                  <p className="text-xs text-slate-500">
                    Soal {currentIndex + 1} dari{" "}
                    {quizData.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 mb-3">
              <p className="text-slate-700 text-[13px] leading-6">
                {current.question}
              </p>
            </div>
            <div className="space-y-3">
                          {current.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelected(idx)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-200 text-left
                ${
                  selected === idx
                    ? "bg-blue-600 border-blue-600 text-white shadow-md"
                    : "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold
                  ${
                    selected === idx
                      ? "bg-white/20 text-white"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {letters[idx]}
                </div>
                <span className="text-[13px] font-medium">
                  {option}
                </span>
              </button>
            ))}
            </div>
            <div className="flex justify-between items-center mt-6">
              <span className="text-xs text-slate-500">
                Pilih satu jawaban yang paling benar.
              </span>
              <button
                onClick={handleNext}
                disabled={selected === null}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLast ? "Selesai" : "Berikutnya"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}