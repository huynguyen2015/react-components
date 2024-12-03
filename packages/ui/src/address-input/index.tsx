import { cn } from "@1hour/utils";
import debounce from "lodash/debounce";
import { useRef, useState } from "react";
import AddressDropdown, { DropdownType } from "./address-dropdown";

interface IProps {
  countries: any;
  cities: any;
  wards: any;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  formClass?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  size?: string;
  type?: string;
}

export const AddressInput: React.FC<IProps> = ({
  countries,
  cities,
  wards,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState({
    country: countries[0]?.name,
    countryCode: countries[0]?.code,
    city: "",
    cityCode: "",
    ward: "",
    wardCode: "",
    address: "",
  });

  const [type, setType] = useState<DropdownType>(""); // Tracks which dropdown is open

  /*
   * Update address component value
   * @field: field to update in address object
   * @option: selected option from dropdown, or input value
   */
  const handleChange = (field: any, option: any) => {
    const updatedAddress = {
      ...address,
      [field]: typeof option === "string" ? option : option.name,
      [`${field}Code`]: option.code,
    };

    // Reset dependent fields if parent value changes
    if (field === "country") {
      updatedAddress.city = "";
      updatedAddress.ward = "";
      updatedAddress.cityCode = "";
      updatedAddress.wardCode = "";
    } else if (field === "city") {
      updatedAddress.ward = "";
      updatedAddress.wardCode = "";
    }

    setAddress(updatedAddress);
    setType(""); // Close dropdown on selection
    const addressString = updatedAddress.address
      ? `${updatedAddress.address}, `
      : "";
    const wardString = updatedAddress.ward ? `${updatedAddress.ward}, ` : "";
    const cityString = updatedAddress.city ? `${updatedAddress.city}, ` : "";
    const countryString = updatedAddress.country
      ? `${updatedAddress.country}, `
      : "";
    const combinedAddress = `${addressString}${wardString}${cityString}${countryString}`;
    onChange?.(combinedAddress);
  };

  /*
   * Debounce address string update to prevent multiple updates
   */
  const updateAddressString = debounce((value: string) => {
    handleChange("address", value);
  }, 300);

  const filteredOptions = (options: any, field: any) => {
    return options.filter(
      (option: any) =>
        field === "country" ||
        (field === "city" && option.fullCode.startsWith(address.countryCode)) ||
        (field === "ward" &&
          option.fullCode.startsWith(
            `${address.countryCode}_${address.cityCode}`
          ))
    );
  };

  const onChangeDropdownType = (type: DropdownType) => {
    setType(type);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className="mt-1 space-y-2 relative">
      {/* Address Display */}
      <div className="flex h-[40px] items-center space-x-[2px] rounded-lg border border-gray-300 px-1">
        {/* Country */}
        <span
          onClick={() => onChangeDropdownType("country")}
          className={cn(
            "cursor-pointer px-1",
            address.country ? "text-gray-700" : "text-gray-500"
          )}
        >
          {address.country ? address.country : "Select country"}
        </span>

        {/* City */}
        {address.country && (
          <>
            <span>\</span>

            <span
              onClick={() => onChangeDropdownType("city")}
              className={cn(
                "cursor-pointer px-1",
                address.city ? "text-gray-700" : "text-gray-500"
              )}
            >
              {address.city ? address.city : "Select city"}
            </span>
          </>
        )}

        {/* Ward */}
        {address.city && (
          <>
            <span>\</span>
            <span
              onClick={() => onChangeDropdownType("ward")}
              className={cn(
                "cursor-pointer px-1",
                address.ward ? "text-gray-700" : "text-gray-500"
              )}
            >
              {address.ward ? address.ward : "Select ward"}
            </span>
          </>
        )}

        {/* Address */}
        {address.ward && (
          <>
            <span>\</span>
            <input
              type="text"
              placeholder={"Enter address"}
              defaultValue={address.address}
              onChange={(e) => updateAddressString(e.target.value)}
              className="flex-1 rounded px-2 outline-none"
            />
          </>
        )}
      </div>
      {/* Dropdown */}
      {type && (
        <AddressDropdown
          type={type}
          options={filteredOptions(
            type === "country" ? countries : type === "city" ? cities : wards,
            type
          )}
          handleChange={handleChange}
        />
      )}
    </div>
  );
};
