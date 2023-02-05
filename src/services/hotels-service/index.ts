import { notFoundError, paymentRequired } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";



async function getHotels(userId:number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
        throw notFoundError();
    }

    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) {
        throw notFoundError();
    }

    const isReserved = ticket.status === "RESERVED";
    const isRemote = ticket.TicketType.isRemote;
    const includesHotel = ticket.TicketType.includesHotel;

    if ( isRemote || isReserved || !includesHotel ){
        throw paymentRequired();
    }
    const hotels = await hotelRepository.findHotels();

    if (!hotels) {
        throw notFoundError();
    }
    return hotels;
}

async function getHotelById(hotelId: number, userId:number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
        throw notFoundError();
    }

    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) {
        throw notFoundError();
    }

    const isReserved = ticket.status === "RESERVED";
    const isRemote = ticket.TicketType.isRemote;
    const includesHotel = ticket.TicketType.includesHotel;

    if ( !ticket || isRemote || isReserved || !includesHotel ){
        throw notFoundError();
    }

    const rooms = await hotelRepository.findHotelById(hotelId);
  
    if (!rooms) {
        throw notFoundError();
    }

    return rooms;
}

const hotelService = {
  getHotels,
  getHotelById
};

export default hotelService;