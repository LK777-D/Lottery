"use client";
import { useEffect, useState } from "react";

import Lotteries from "@/components/lotteries/Lotteries";
import Winners from "@/components/winners/Winners";
import Showcase from "@/components/Showcase";

export default function Home() {
  return (
    <main>
      <Showcase />
      <Lotteries />
      <Winners />
    </main>
  );
}
