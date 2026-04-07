"use client"

import { SummaryCardProps } from "@/components/summaryCard";
import SummaryCard from "@/components/summaryCard";

// TODO:Buat menjadi dynamic mengambil data dari database
const stats = [
  { id: '1', value: '1,2', unit: 'Ha', label: 'Luas Lahan', iconEmoji: '📐' },
  { id: '2', value: '1250', unit: 'Batang', label: 'Total Tanaman', iconEmoji: '🌱' },
  { id: '3', value: '1250', unit: 'Batang', label: 'Total Tanaman', iconEmoji: '🌱' },
  { id: '4', value: '1250', unit: 'Batang', label: 'Total Tanaman', iconEmoji: '🌱' }

];

export default function OwnerHome() {
  {
    stats.map((item) => (
      <SummaryCard key={item.id} {...item} />
    ))
  }
}
