// src/components/PriceInput.jsx
export default function PriceInput({ isPercent, setIsPercent, amount, setAmount }) {
    const handleInput = (e) => {
      const val = e.target.value;
      // Allow only numbers, no 'e', '-', or letters
      if (/^\d*$/.test(val)) {
        setAmount(val);
      }
    };
  
    return (
      <div>
        <label className="block font-semibold mb-1">Price or Discount</label>
        <div className="flex gap-4 mb-2">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={!isPercent}
              onChange={() => setIsPercent(false)}
            />
            $ Amount
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={isPercent}
              onChange={() => setIsPercent(true)}
            />
            % Off
          </label>
        </div>
        <div className="flex items-center">
          {isPercent ? null : <span className="mr-2 text-lg font-semibold">$</span>}
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={handleInput}
            className="border p-2 w-full"
            placeholder={isPercent ? "Enter % off" : "Enter price"}
          />
          {isPercent && <span className="ml-2 text-lg font-semibold">%</span>}
        </div>
      </div>
    );
  }
  