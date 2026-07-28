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
const letters = [
  "A",
  "B",
  "C",
  "D",
];
export default function QuizPage() {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);
  const [quizData, setQuizData] =
    useState<Question[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [currentIndex, setCurrentIndex] =
    useState(0);
  const [selected, setSelected] =
    useState<number | null>(null);
  const [answers, setAnswers] =
    useState<number[]>([]);
  const [finished, setFinished] =
    useState(false);
  useEffect(() => {
    getSoal();
  }, []);
  const getSoal = async () => {
    try {
      setLoading(true);
      const { data, error } =
        await supabase
          .from("soal").select("*").order("id", {ascending: true,});
      if (error) {
        throw error;
      }
      const hasil: Question[] =
        data.map((item) => ({
          id: item.id,
          question:item.pertanyaan,
          options: [
            item.opsi_a,
            item.opsi_b,
            item.opsi_c,
            item.opsi_d,
          ],
          correct:item.jawaban,
        }));
      setQuizData(hasil);
    } catch (error) {
      console.log(
        "Gagal mengambil soal:",
        error
      );
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center ">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin">
        </div>
      </div>
    );
  }
  if (quizData.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm">
          Belum ada soal quiz.
        </p>
      </div>
    );
  }
    const current =
    quizData[currentIndex];
  const isLast =
    currentIndex === quizData.length - 1;
  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [
      ...answers,
      selected,
    ];
    setAnswers(newAnswers);
    if (isLast) {
      setFinished(true);
    } else {
      setCurrentIndex(
        (prev) => prev + 1
      );
      setSelected(null);
    }
  };
  const score =
    answers.reduce(
      (total, answer, index) => {
        return answer === quizData[index].correct ? total + Math.floor(100 / quizData.length) : total;
      },
      0
    );
  if (finished) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={
            setIsSidebarOpen
          }
        />
        <main className="md:ml-64 flex flex-col min-h-screen">
          <Header
            setIsSidebarOpen={
              setIsSidebarOpen
            }
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
                onClick={() => {
                  setCurrentIndex(0);
                  setAnswers([]);
                  setSelected(null);
                  setFinished(false);
                }}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 transition text-white py-2.5 rounded-lg text-sm font-semibold">
                Ulangi Quiz
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
    return (
    <div className="
      min-h-screen
      bg-slate-100
    ">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={
          setIsSidebarOpen
        }
      />
      <main className="md:ml-64 flex flex-col min-h-screen">
        <Header
          setIsSidebarOpen={
            setIsSidebarOpen
          }
        />
        <div className="
          flex-1
          p-5
        ">
          <div className="
            max-w-3xl
            mx-auto
            bg-white
            rounded-xl
            shadow-md
            border
            border-slate-200
            p-5
          ">
            <div className="
              flex
              justify-between
              items-center
              mb-5
            ">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {currentIndex + 1}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 text-sm">
                    Pertanyaan Quiz
                  </h2>
                  <p className="text-xs text-slate-500">
                    Soal {currentIndex + 1} dari {quizData.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-4">
              <p className="text-slate-700 text-sm leading-5">
                {current.question}
              </p>
            </div>
            <div className="space-y-2.5">
              {current.options.map(
                (option, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setSelected(idx)
                    }
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-200 text-left
                      ${
                        selected === idx
                        ? 
                        "bg-blue-600 border-blue-600 text-white shadow-md"
                        :
                        "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700"
                      }
                    `}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                      ${selected === idx ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"
                      }
                    `}>
                      {letters[idx]}
                    </div>
                    <span className="text-xs font-medium">
                      {option}
                    </span>
                  </button>
                )
              )}
            </div>
              <div className="flex justify-between items-center mt-5">
              <span className="text-[11px] text-slate-500">
                Pilih satu jawaban yang paling benar.
              </span>
              <button
                onClick={handleNext}
                disabled={
                  selected === null
                }
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed">
                {
                  isLast
                    ? "Selesai"
                    : "Berikutnya"
                }
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}