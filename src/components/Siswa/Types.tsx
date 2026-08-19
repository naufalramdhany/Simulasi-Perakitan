export type ComponentType =
  | "cpu"
  | "ram"
  | "cooler"
  | "vga"
  | "psu"
  | "cmos_battery"
  | "cable_atx-24"
  | "cable_atx-4"
  | "cable_vga";

export interface Slot {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ComputerComponent {
  id: number;
  name: string;
  image: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  slotId: string | null;
  isCorrect?: boolean;
    rotation?: number;
}