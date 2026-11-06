import { AppLayout } from "@/components/layout";

const cartItems = [
  {
    id: "1",
    name: "Labbaik Chicken",
    subtitle: "The first oven fried chicken",
    price: 67356,
    image:
      "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "2",
    name: "Labbaik Chicken",
    subtitle: "The first oven fried chicken",
    price: 67356,
    image:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80",
  },
];

export default function CartPage() {
  return (
    <AppLayout
      role="buyer"
      isAuthenticated
      title="My Cart"
      showHeader
      headerClassName="bg-[#1bb0c7] px-5 pb-5 pt-8"
      bodyClassName="bg-[#e6e0c8] px-4 py-5"
    >
      <div className="space-y-4 pb-4">
        {cartItems.map((item) => (
          <div key={item.id} className="rounded-[18px] border border-[#d7d0b4] bg-[#f7f0dc] p-3 shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-[76px] w-[92px] rounded-xl object-cover"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-[1.15rem] font-bold text-[#1b8ca3]">{item.name}</h3>
                    <p className="text-sm text-[#5d625b]">{item.subtitle}</p>
                  </div>
                  <button type="button" aria-label="Remove item" className="text-2xl font-bold text-[#f15d69]">
                    ×
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-lg font-bold text-[#1a1a1a]">Rp. {item.price.toLocaleString("id-ID")}</p>
                  <div className="flex items-center">
                    <button type="button" className="flex h-8 w-8 items-center justify-center rounded-l-md bg-[#ff4d57] text-lg font-bold text-white">−</button>
                    <span className="flex h-8 w-9 items-center justify-center bg-[#ff4d57] text-sm font-bold text-white">1</span>
                    <button type="button" className="flex h-8 w-8 items-center justify-center rounded-r-md bg-[#ff4d57] text-lg font-bold text-white">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-t-md border-t border-[#d6cebb] bg-[#e6e0c8] px-1 pt-4">
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[1.6rem] font-medium text-[#1b1b1b]">
          <span>Total</span>
          <span className="text-right">Rp. 135.352</span>
          <span>Discount</span>
          <span className="text-right">Rp. 10</span>
          <span className="font-bold">Subtotal</span>
          <span className="text-right font-bold">Rp. 135.352</span>
        </div>

        <button type="button" className="mt-6 w-full rounded-md bg-[#f25f4b] px-4 py-4 text-2xl font-black text-white shadow-sm">
          Buy Now
        </button>
      </div>
    </AppLayout>
  );
}
