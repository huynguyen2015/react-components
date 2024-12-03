import { useEffect, useRef, useState } from "react";
export type DropdownType = "country" | "city" | "ward" | "";
interface DropdownProps {
  type: DropdownType;
  options: any[];
  handleChange: (type: string, option: any) => void;
}

const AddressDropdown: React.FC<DropdownProps> = ({
  type,
  options,
  handleChange,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<"above" | "below">("below");
  const [displayOptions, setDisplayOption] = useState(options);

  const filteredOptions = (search: any) => {
    setDisplayOption(
      options.filter((option: any) =>
        option.searchName.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  useEffect(() => {
    const handlePosition = () => {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.bottom > windowHeight) {
          setPosition("above");
        } else {
          setPosition("below");
        }
      }
    };

    handlePosition();
    window.addEventListener("resize", handlePosition);
    return () => {
      window.removeEventListener("resize", handlePosition);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-10 w-full rounded-md bg-white p-4 shadow-md ${
        position === "above" ? "bottom-full mb-2" : "top-full mt-2"
      }`}
    >
      <input
        type="text"
        placeholder={`Search ${type}`}
        onChange={(e) => filteredOptions(e.target.value)}
        className="mb-2 w-full rounded border border-gray-300 px-2 py-1"
      />
      <div className="max-h-40 overflow-y-auto">
        {displayOptions.map((option: any) => (
          <div
            key={option.name}
            onClick={() => handleChange(type, option)}
            className="cursor-pointer p-2 text-slate-500 transition-all duration-100 hover:text-slate-600"
          >
            {option.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressDropdown;
