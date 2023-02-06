import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createHotelRoom(hotelId:number) {
  return await prisma.room.create({
    data: {
      name: faker.name.firstName(),
      capacity: faker.datatype.number({min:1, max:2}),
      hotelId:hotelId,
    },
  });
}

