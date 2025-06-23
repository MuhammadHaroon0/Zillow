import { formatAddress, formatPropertyValue } from "./utils";

interface PropertyCardProps {
  property: any;
  selectedState: string[];
  columns: readonly { readonly id: string; readonly label: string }[];
  onClick: () => void;
}

const PropertyCard = ({
  property,
  selectedState,
  columns,
  onClick,
}: PropertyCardProps) => {
  return (
    <div
      className="w-fit py-3 border border-[#E5E5E5] rounded-lg my-2 hover:border-black cursor-default"
      onClick={onClick}
    >
      <table className="w-full table-fixed">
        <tbody>
          <tr>
            {selectedState.map((columnId) => (
              <td key={columnId} className="text-sm text-center px-2 py-1 w-26">
                {formatPropertyValue(property, columnId)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PropertyCard;
