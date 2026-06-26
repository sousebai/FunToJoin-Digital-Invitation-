// ─── seed.js ──────────────────────────────────────────────────────────────────
// Seeds the database with realistic users, public channels, and posts.
// Run once: node seed.js
// Re-run safely: existing seeded users are skipped (checked by email).
// ─────────────────────────────────────────────────────────────────────────────

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import ChatRoom from './models/ChatRoom.js';
import Post from './models/Post.js';
import Message from './models/Message.js';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_USERS = [
  {
    name: 'Alex Rivera',
    email: 'alex@mosmagram.com',
    password: 'password123',
    bio: '📸 Street photographer & coffee addict. NYC based.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4',
    status: 'online',
  },
  {
    name: 'Sophia Chen',
    email: 'sophia@mosmagram.com',
    password: 'password123',
    bio: '🎨 UI/UX Designer. Making the web beautiful one pixel at a time.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&backgroundColor=ffdfbf',
    status: 'online',
  },
  {
    name: 'Marcus Williams',
    email: 'marcus@mosmagram.com',
    password: 'password123',
    bio: '💻 Full-stack dev. Open source contributor. Loves dark mode.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=c0aede',
    status: 'away',
  },
  {
    name: 'Priya Sharma',
    email: 'priya@mosmagram.com',
    password: 'password123',
    bio: '🌏 Travel blogger. 47 countries and counting ✈️',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffd5dc',
    status: 'online',
  },
  {
    name: 'Jordan Lee',
    email: 'jordan@mosmagram.com',
    password: 'password123',
    bio: '🎵 Music producer & beat maker. Tokyo → London.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan&backgroundColor=d1f4cc',
    status: 'offline',
  },
  {
    name: 'Isabella Torres',
    email: 'isabella@mosmagram.com',
    password: 'password123',
    bio: '🏋️ Fitness coach & nutritionist. Living my best life.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella&backgroundColor=b6e3f4',
    status: 'online',
  },
  {
    name: 'Ethan Park',
    email: 'ethan@mosmagram.com',
    password: 'password123',
    bio: '🎮 Game dev at indie studio. Dog dad 🐕',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan&backgroundColor=c0aede',
    status: 'online',
  },
  {
    name: 'Zara Ahmed',
    email: 'zara@mosmagram.com',
    password: 'password123',
    bio: '📖 Author | 3 novels published | Writing my 4th.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zara&backgroundColor=ffd5dc',
    status: 'away',
  },
];

const SEED_ROOMS = [
  {
    name: 'general',
    description: '👋 Welcome! Introduce yourself and say hi to the community.',
    type: 'public',
    adminIndex: 0, // Alex Rivera
  },
  {
    name: 'design-inspiration',
    description: '🎨 Share your latest design work, mood boards and creative ideas.',
    type: 'public',
    adminIndex: 1, // Sophia Chen
  },
  {
    name: 'dev-talk',
    description: '💻 All things programming. Tips, tricks, code reviews welcome.',
    type: 'public',
    adminIndex: 2, // Marcus Williams
  },
  {
    name: 'travel-diary',
    description: '✈️ Share your travel photos and recommendations from around the world.',
    type: 'public',
    adminIndex: 3, // Priya Sharma
  },
  {
    name: 'music-lounge',
    description: '🎵 Share tracks, playlists, and talk about music production.',
    type: 'public',
    adminIndex: 4, // Jordan Lee
  },
  {
    name: 'fitness-hub',
    description: '💪 Workout tips, nutrition advice, and motivation to keep you going.',
    type: 'public',
    adminIndex: 5, // Isabella Torres
  },
  {
    name: 'gaming-zone',
    description: '🎮 Game discussions, reviews, and looking for party members.',
    type: 'public',
    adminIndex: 6, // Ethan Park
  },
];

const SEED_POSTS = [
  {
    authorIndex: 0,
    caption: '☕ Started the morning with a fresh espresso and my camera. NYC never disappoints — caught this golden hour shot in Brooklyn. What a city! 🌅 #streetphotography #nyc #goldenhour',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
  },
  {
    authorIndex: 1,
    caption: '✨ Just shipped a new design system for a fintech client. Spent 3 weeks perfecting the color palette and typography. The details matter! What do you think? 🎨 #uidesign #designsystems',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80',
  },
  {
    authorIndex: 2,
    caption: 'Dark mode or light mode? That is the question... I shipped a feature today that lets users pick their theme. Check out the before/after 👀 #webdev #react #darkmode',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
  },
  {
    authorIndex: 3,
    caption: '🗼 Country #47! Finally made it to Japan and it absolutely lived up to the hype. The food, the culture, the people — incredible experience. Next stop: Iceland 🧊 #travel #japan #wanderlust',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
  },
  {
    authorIndex: 4,
    caption: '🎹 Just dropped a new lo-fi beat. Spent the weekend in the studio layering textures. Link in bio if you want to stream it 🎵 #musicproduction #lofi #beatmaker',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
  },
  {
    authorIndex: 5,
    caption: '💪 6AM workout hit different when you actually enjoy it! Here\'s my morning routine that helped me drop 10kg in 4 months. Consistency is everything. Save this post! 🔥 #fitness #workout #health',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  },
  {
    authorIndex: 6,
    caption: 'Just released v0.3 of my indie game! 2 years of solo dev, countless late nights, but watching people actually play it... worth every second 🎮❤️ #indiedev #gamedev #unity',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
  },
  {
    authorIndex: 7,
    caption: '📖 Chapter 1 of book #4 is DONE. Writing a novel is basically going on a really long solo journey that changes you by the end. Currently: terrified and excited in equal measure ✍️ #writing #author #amwriting',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
  },
  {
    authorIndex: 0,
    caption: 'Rain in the city hits different with a good lens 🌧️ Shot this through a coffee shop window — sometimes the best photos are the unplanned ones. #photography #rainy #streetlife',
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80',
  },
  {
    authorIndex: 1,
    caption: 'Prototyping session today 🔄 There\'s something magical about watching a wireframe evolve into a real interface. Love this part of the process! #ux #prototype #designprocess',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80',
  },
];

const SEED_MESSAGES = [
  { roomIndex: 0, authorIndex: 0, content: 'Hey everyone! Welcome to MosMa 👋 excited to have you all here!' },
  { roomIndex: 0, authorIndex: 1, content: 'This platform looks amazing! Love the design 😍' },
  { roomIndex: 0, authorIndex: 2, content: 'Great to be here. Anyone else a developer? Let\'s connect!' },
  { roomIndex: 0, authorIndex: 3, content: 'Hello from Tokyo! 🗼 Currently on my world tour' },
  { roomIndex: 0, authorIndex: 4, content: 'Vibes ✨ already loving this community' },
  { roomIndex: 1, authorIndex: 1, content: 'Just posted my latest UI kit — check the feed! 🎨' },
  { roomIndex: 1, authorIndex: 0, content: 'Love the color palette you used, Sophia!' },
  { roomIndex: 1, authorIndex: 6, content: 'Anyone have good resources for game UI design?' },
  { roomIndex: 2, authorIndex: 2, content: 'React 19 dropped some 🔥 features. Anyone tried the new use() hook?' },
  { roomIndex: 2, authorIndex: 6, content: 'Been experimenting with it. Game-changer for async state!' },
  { roomIndex: 3, authorIndex: 3, content: 'Just landed in Kyoto! The temples are breathtaking 🏯' },
  { roomIndex: 3, authorIndex: 4, content: 'One of my favourite cities! Try the matcha ice cream 🍦' },
  { roomIndex: 4, authorIndex: 4, content: 'New beat just dropped 🎵 Check my profile!' },
  { roomIndex: 4, authorIndex: 7, content: 'This playlist is perfect for writing sessions 📖' },
  { roomIndex: 5, authorIndex: 5, content: 'Morning workout complete ✅ Who else is up early today?' },
  { roomIndex: 5, authorIndex: 3, content: 'Just back from a yoga class! Feeling amazing 🧘' },
  { roomIndex: 6, authorIndex: 6, content: 'v0.3 update is live! Added 3 new levels and a boss fight 🎮' },
  { roomIndex: 6, authorIndex: 2, content: 'Congrats! Indie dev journey is so inspiring. Keep going!' },
];

// ─── Main seed function ───────────────────────────────────────────────────────

async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ── 1. Create users ──────────────────────────────────────────────────────
    console.log('\n👤 Seeding users...');
    const createdUsers = [];

    for (const userData of SEED_USERS) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`  ⏭  Skipped (exists): ${userData.name}`);
        createdUsers.push(existing);
        continue;
      }

      // Hash password manually since we're bypassing the pre-save hook
      // Actually the pre-save hook will fire on User.create(), so just pass plain
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`  ✅ Created: ${userData.name}`);
    }

    // ── 2. Make everyone friends with everyone else ──────────────────────────
    console.log('\n🤝 Linking friends...');
    for (const user of createdUsers) {
      const otherIds = createdUsers
        .filter((u) => u._id.toString() !== user._id.toString())
        .map((u) => u._id);

      // Only update if friends array is empty
      if (!user.friends || user.friends.length === 0) {
        await User.findByIdAndUpdate(user._id, { friends: otherIds });
      }
    }
    console.log('  ✅ All users connected as friends');

    // ── 3. Create public rooms ───────────────────────────────────────────────
    console.log('\n💬 Seeding chat rooms...');
    const createdRooms = [];

    for (const roomData of SEED_ROOMS) {
      const existing = await ChatRoom.findOne({ name: roomData.name, type: 'public' });
      if (existing) {
        console.log(`  ⏭  Skipped (exists): #${roomData.name}`);
        createdRooms.push(existing);
        continue;
      }

      const admin = createdUsers[roomData.adminIndex];
      // All seeded users are members of every room
      const memberIds = createdUsers.map((u) => u._id);

      const room = await ChatRoom.create({
        name: roomData.name,
        description: roomData.description,
        type: roomData.type,
        admin: admin._id,
        members: memberIds,
      });

      createdRooms.push(room);
      console.log(`  ✅ Created: #${roomData.name}`);
    }

    // ── 4. Seed posts ────────────────────────────────────────────────────────
    console.log('\n📸 Seeding posts...');

    for (const postData of SEED_POSTS) {
      const author = createdUsers[postData.authorIndex];

      // Check if this post already exists for this author (by caption prefix)
      const existing = await Post.findOne({
        author: author._id,
        caption: { $regex: postData.caption.substring(0, 30), $options: 'i' },
      });

      if (existing) {
        console.log(`  ⏭  Skipped (exists): post by ${author.name}`);
        continue;
      }

      // Add some likes from random users
      const likeCount = Math.floor(Math.random() * (createdUsers.length - 1)) + 1;
      const likes = createdUsers
        .filter((u) => u._id.toString() !== author._id.toString())
        .slice(0, likeCount)
        .map((u) => u._id);

      const post = await Post.create({
        author: author._id,
        caption: postData.caption,
        image: postData.image,
        likes,
      });

      // Add a comment or two
      const commenter1 = createdUsers[(postData.authorIndex + 1) % createdUsers.length];
      const commenter2 = createdUsers[(postData.authorIndex + 2) % createdUsers.length];

      const commentTexts = [
        'This is absolutely stunning! 🔥',
        'Love this so much! Keep it up 💯',
        'Incredible work as always! ✨',
        'This made my day! 😍',
        'You\'re so talented! 👏',
        'Goals! 💪',
        'Wow, this is next level!',
        'Amazing content as always 🙌',
      ];

      post.comments.push({
        user: commenter1._id,
        text: commentTexts[Math.floor(Math.random() * commentTexts.length)],
      });
      post.comments.push({
        user: commenter2._id,
        text: commentTexts[Math.floor(Math.random() * commentTexts.length)],
      });
      await post.save();

      console.log(`  ✅ Created post by ${author.name}`);
    }

    // ── 5. Seed messages ─────────────────────────────────────────────────────
    console.log('\n💬 Seeding messages...');

    for (const msgData of SEED_MESSAGES) {
      const room = createdRooms[msgData.roomIndex];
      const author = createdUsers[msgData.authorIndex];
      if (!room || !author) continue;

      const existing = await Message.findOne({
        room: room._id,
        sender: author._id,
        content: msgData.content,
      });

      if (existing) {
        console.log(`  ⏭  Skipped (exists): message in #${room.name}`);
        continue;
      }

      const message = await Message.create({
        room: room._id,
        sender: author._id,
        content: msgData.content,
        type: 'text',
      });

      // Update room's lastMessage
      await ChatRoom.findByIdAndUpdate(room._id, { lastMessage: message._id });
      console.log(`  ✅ Message in #${room.name} by ${author.name}`);
    }

    console.log('\n🎉 ─────────────────────────────────────────────');
    console.log('✅ Database seeded successfully!');
    console.log(`   👤 Users:    ${createdUsers.length}`);
    console.log(`   💬 Rooms:    ${createdRooms.length}`);
    console.log(`   📸 Posts:    up to ${SEED_POSTS.length}`);
    console.log(`   💬 Messages: up to ${SEED_MESSAGES.length}`);
    console.log('\n📝 Test login credentials (any seeded user):');
    console.log('   Email:    alex@mosmagram.com');
    console.log('   Password: password123');
    console.log('─────────────────────────────────────────────────\n');

  } catch (err) {
    console.error('❌ Seed error:', err.message);
    console.error(err.stack);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  }
}

seed();
