import { notFoundError, paymentRequired } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import paymentRepository from "@/repositories/payment-repository";


async function getHotels(userId:number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
        throw notFoundError();
    }

    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) {
        throw notFoundError();
    }
    const payment = await paymentRepository.findPaymentByTicketId(ticket.id);

    if (!payment){
        throw paymentRequired();
    }

    const isReserved = ticket.status === "RESERVED";
    const isRemote = ticket.TicketType.isRemote;
    const includesHotel = ticket.TicketType.includesHotel;

    if ( isRemote || isReserved || !includesHotel ){
        throw paymentRequired();
    }
    const hotels = await hotelRepository.findHotels();

    return hotels;
}

async function verifyPayment(userId:number){

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
        throw notFoundError();
    }

    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) {
        throw notFoundError();
    }

    const payment = await paymentRepository.findPaymentByTicketId(ticket.id);

    if (!payment){
        throw paymentRequired();
    }

    const isReserved = ticket.status === "RESERVED";
    const isRemote = ticket.TicketType.isRemote;
    const includesHotel = ticket.TicketType.includesHotel;

    if ( isRemote || isReserved || !includesHotel ){
        throw paymentRequired();
    }
}

async function getHotelById(hotelId: number, userId:number) {
    await verifyPayment(userId);
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