const mongoose = require('mongoose');

const Event = require('../src/models/Event');
const Participant = require('../src/models/Participant');
const DrawHistory = require('../src/models/DrawHistory');
const Evaluation = require('../src/models/Evaluation');
const GiftSuggestion = require('../src/models/GiftSuggestion');
const Message = require('../src/models/Message');
const Notice = require('../src/models/Notice');

async function seed() {
  await mongoose.connect('mongodb://127.0.0.1:27017/class-saas');

  console.log('🧹 Limpando banco...');
  await Promise.all([
    Event.deleteMany({}),
    Participant.deleteMany({}),
    DrawHistory.deleteMany({}),
    Evaluation.deleteMany({}),
    GiftSuggestion.deleteMany({}),
    Message.deleteMany({}),
    Notice.deleteMany({}),
  ]);

  console.log('🎉 Criando Event...');
  const event = await Event.create({
    name: 'Amigo Secreto 2026',
    year: 2026,
    status: 'active',
    sponsorPassword: '123456', // será hasheada pelo schema
  });

  console.log('👥 Criando Participants...');
  const participants = await Participant.insertMany([
    {
      name: 'Ana',
      ramal: '101',
      codename: 'Panda',
      eventId: event._id,
    },
    {
      name: 'Bruno',
      ramal: '102',
      codename: 'Lobo',
      eventId: event._id,
    },
    {
      name: 'Carla',
      ramal: '103',
      codename: 'Fênix',
      eventId: event._id,
    },
    {
      name: 'Diego',
      ramal: '104',
      codename: 'Tigre',
      eventId: event._id,
    },
  ]);

  console.log('🎁 Criando DrawHistory...');
  await DrawHistory.create({
    eventId: event._id,
    year: 2026,
    pairs: [
      {
        giverId: participants[0]._id,
        receiverId: participants[1]._id,
      },
      {
        giverId: participants[1]._id,
        receiverId: participants[2]._id,
      },
    ],
  });

  console.log('⭐ Criando Evaluations...');
  await Evaluation.insertMany([
    {
      participantId: participants[0]._id,
      eventId: event._id,
      rating: 5,
      comment: 'Muito bom!',
    },
    {
      participantId: participants[1]._id,
      eventId: event._id,
      rating: 4,
      comment: 'Gostei bastante',
    },
  ]);

  console.log('🎯 Criando GiftSuggestions...');
  await GiftSuggestion.insertMany([
    {
      participantId: participants[0]._id,
      eventId: event._id,
      suggestions: ['Livro', 'Caneca personalizada'],
    },
    {
      participantId: participants[1]._id,
      eventId: event._id,
      suggestions: ['Fone de ouvido', 'Chocolate'],
    },
  ]);

  console.log('💬 Criando Messages...');
  await Message.insertMany([
    {
      eventId: event._id,
      senderId: participants[0]._id,
      recipientId: participants[1]._id,
      content: 'Feliz amigo secreto! 🎁',
    },
    {
      eventId: event._id,
      senderId: participants[2]._id,
      recipientId: participants[3]._id,
      content: 'Você vai gostar do presente 😏',
    },
  ]);

  console.log('📢 Criando Notices...');
  await Notice.insertMany([
    {
      eventId: event._id,
      content: 'O sorteio será realizado no dia 20/12!',
    },
    {
      eventId: event._id,
      content: 'Não esqueçam de comprar os presentes 🎄',
    },
  ]);

  console.log('✅ SEED FINALIZADO COM SUCESSO');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Erro no seed:', err);
});