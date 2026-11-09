import { AppLayout } from "@/components/layout";
import TombolKeluar from "@/components/akun/TombolKeluar";

const streak = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function RewardPage() {
  return (
    <AppLayout
      role="buyer"
      isAuthenticated
      title="My Reward"
      showHeader
      headerClassName="bg-[#f56369] px-5 pb-5 pt-8"
      bodyClassName="bg-[#e6e0c8] px-4 py-5"
    >
      <div className="space-y-5">
        <div className="rounded-[20px] bg-[#f6f0de] p-4 text-center shadow-sm">
          <div className="mb-4 flex justify-center">
            <div className="flex h-32 w-44 items-center justify-center rounded-full bg-[#f1d69a] text-5xl shadow-inner">
              🥚
            </div>
          </div>

          <h3 className="text-[2rem] font-black tracking-[-0.05em] text-[#f15a62]">3 Day Streak</h3>

          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-sm font-bold text-[#ef5e63]">
            {streak.map((day, index) => (
              <div key={day} className={index < 3 ? "text-[#ef5e63]" : "text-[#c7bba0]"}>
                <div className="mb-1 text-2xl">🔥</div>
                <div>{day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[18px] bg-[#f4efe3] p-4 shadow-sm">
          <div className="flex items-center justify-between text-[1.7rem] font-black text-[#1d9eb8]">
            <span>Total Point</span>
            <span>67</span>
          </div>

          <div className="rounded-[18px] bg-[#f8b638] px-5 py-4 text-white shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[3rem] font-black">10%</span>
              <div className="text-right">
                <div className="text-[1.9rem] font-bold">Discount</div>
                <div className="text-sm opacity-90">Expire Date : 10/28/2026</div>
              </div>
            </div>
          </div>
        </div>

        <TombolKeluar />
      </div>
    </AppLayout>
  );
}
