import { showAlert } from "@/utils/alertStore";

interface CartPayload {
  room: any;
  slug: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  currencyIcon: string;
}

export const buildRoomCartItem = ({
  room,
  slug,
  checkIn,
  checkOut,
  rooms,
  adults,
  children,
  currencyIcon
}: CartPayload) => {

  const basePrice = room.price;

  const baseAdults = room.baseAdults || 2;
  const baseChildren = room.baseChildren || 0;
  const maxAdults = room.maxAdults || 2;
  const maxChildren = room.maxChildren || 1;

  const extraAdultPrice = room.extraAdultPrice || 0;
  const extraChildPrice = room.extraChildPrice || 0;

  const extraAdults = Math.max(0, adults - baseAdults);
  const extraChildren = Math.max(0, children - baseChildren);

  const extrasPerRoom =
    extraAdults * extraAdultPrice +
    extraChildren * extraChildPrice;

  const roomPricePerNight = basePrice + extrasPerRoom;
  const baseTotal = roomPricePerNight * rooms;

  const taxes = baseTotal * 0.1;
  const serviceCharge = baseTotal * 0.05;
  const grandTotal = baseTotal + taxes + serviceCharge;

  return {
    roomId: room._id,
    roomSlug: slug,
    roomName: room.title || room.name,
    image: room.previewImage || room.images?.[0] || "",
    checkIn,
    checkOut,
    guestDetails: {
      rooms,
      adults,
      children
    },
    financials: {
      baseTotal,
      taxes,
      serviceCharge,
      grandTotal,
      currency: currencyIcon
    },
    totalAmount: grandTotal
  };
};
