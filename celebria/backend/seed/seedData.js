const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Invitation = require('../models/Invitation');
const Rsvp = require('../models/Rsvp');

const seedDB = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/celebria_db');
    console.log('[Seed] Connected to MongoDB.');

    // Clear existing data
    await User.deleteMany();
    await Invitation.deleteMany();
    await Rsvp.deleteMany();
    console.log('[Seed] Cleared existing data.');

    // 1. Create Demo User
    const demoUser = await User.create({
      name: 'Alexandre & Sophia',
      email: 'demo@celebria.com',
      password: 'Password123!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    });
    console.log(`[Seed] Demo User created: ${demoUser.email} / Password123!`);

    // 2. Create Wedding Invitation
    const weddingDate = new Date();
    weddingDate.setDate(weddingDate.getDate() + 45); // 45 days in future

    const weddingInvite = await Invitation.create({
      user: demoUser._id,
      title: "Sophia & Alexandre's Royal Wedding Gala",
      slug: 'sophia-alexandre-wedding',
      ceremonyType: 'wedding',
      hostNames: 'Sophia Laurent & Alexandre Dubois',
      eventDate: weddingDate,
      eventTime: '16:00',
      timezone: 'CET',
      venueName: 'Château de Montmirail',
      venueAddress: '15 Route des Princes, 60500 Chantilly, France',
      mapUrl: 'https://maps.google.com/?q=Château+de+Chantilly+France',
      dressCode: 'Black Tie & Champagne Elegance',
      dressCodeColors: ['#D4AF37', '#1E293B', '#F8FAFC', '#991B1B'],
      story: 'Ten years ago, we met under the autumn trees of Luxembourg Gardens. Today, with full hearts and blessed by family, we invite our closest friends and loved ones to celebrate the beginning of our forever.',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      theme: {
        id: 'champagne-silk',
        primaryColor: '#C5A059',
        accentColor: '#B86B77',
        bgColor: '#FAF7F2',
        textColor: '#2D2A26',
        fontFamily: 'playfair',
        envelopeColor: '#F5EFE6',
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-114281.mp3',
        musicTitle: 'Canon in D - Romantic Acoustic'
      },
      schedule: [
        { time: '16:00', title: 'Guest Arrival & Welcome Champagne', description: 'Enjoy string quartet melodies and sparkling French cider on the lawn.', icon: 'glass' },
        { time: '17:00', title: 'Solemn Exchange of Vows', description: 'The official ceremony in the Rose Garden.', icon: 'heart' },
        { time: '18:30', title: 'Cocktail & Hors d’œuvres', description: 'Canapés, live acoustic jazz, and sunset photography.', icon: 'music' },
        { time: '20:00', title: 'Candlelit Gala Dinner', description: 'Four-course gastronomic dinner followed by heartfelt toasts.', icon: 'utensils' },
        { time: '22:30', title: 'First Dance & Dancing Until Dawn', description: 'Cake cutting and midnight dancing under starry chandeliers.', icon: 'sparkles' }
      ],
      registryInfo: {
        title: 'Honeymoon Wishing Well',
        description: 'Your presence at our celebration is the greatest gift of all. If you wish to bless us with a token of affection, we have set up a wishing well for our dream trip to Kyoto and the Amalfi Coast.',
        wishingWellNote: 'A dedicated gift box will be available at the reception hall.',
        bankDetails: 'IBAN: FR76 3000 4000 0001 2345 6789 01\nBIC: BNPAFRPPXXX\nAccount Holder: Sophia & Alexandre Dubois'
      },
      settings: {
        allowPlusOnes: true,
        maxPlusOnes: 2,
        showWishesWall: true,
        rsvpDeadline: new Date(weddingDate.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days before
        contactEmail: 'sophia.alexandre@celebria.com',
        contactPhone: '+33 6 12 34 56 78'
      },
      status: 'published'
    });

    // 3. Create Graduation Invitation
    const gradDate = new Date();
    gradDate.setDate(gradDate.getDate() + 20);

    const gradInvite = await Invitation.create({
      user: demoUser._id,
      title: 'Ethan Brooks - Master of Science Graduation Celebration',
      slug: 'ethan-brooks-graduation-2026',
      ceremonyType: 'graduation',
      hostNames: 'Ethan Brooks & The Brooks Family',
      eventDate: gradDate,
      eventTime: '15:30',
      timezone: 'CET',
      venueName: 'The Skyline Glass Pavilion',
      venueAddress: '42 Boulevard Haussmann, 75009 Paris',
      mapUrl: 'https://maps.google.com/?q=Paris+Boulevard+Haussmann',
      dressCode: 'Academic Chic / Smart Cocktail',
      dressCodeColors: ['#047857', '#F59E0B', '#1E293B', '#F1F5F9'],
      story: 'Five years of late-night coding, algorithms, research papers, and unforgettable friendships. Come raise a glass with me as I officially receive my Master of Science in Software Engineering!',
      coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      theme: {
        id: 'botanical-sage',
        primaryColor: '#52796F',
        accentColor: '#C5A059',
        bgColor: '#F0F5F2',
        textColor: '#2D2A26',
        fontFamily: 'serif',
        envelopeColor: '#E6EFEA'
      },
      schedule: [
        { time: '15:30', title: 'Official Convocation Ceremony', description: 'Cap toss and diploma conferral.', icon: 'award' },
        { time: '17:30', title: 'Rooftop Reception & Tapas', description: 'Craft cocktails, live DJ, and graduation toast.', icon: 'glass' },
        { time: '20:00', title: 'Celebration Dinner & Afterparty', description: 'Dinner, speeches, and celebration into the night.', icon: 'sparkles' }
      ],
      registryInfo: {
        title: 'Career Launch Fund',
        description: 'Your encouragement and presence mean everything! For those who asked about gifts, support towards Ethan’s relocation and workspace setup is deeply appreciated.',
        bankDetails: 'PayPal: ethan.brooks.grad@email.com'
      },
      settings: {
        allowPlusOnes: true,
        maxPlusOnes: 3,
        showWishesWall: true,
        rsvpDeadline: new Date(gradDate.getTime() - 7 * 24 * 60 * 60 * 1000)
      },
      status: 'published'
    });

    // 4. Create Gender Reveal Invitation
    const genderDate = new Date();
    genderDate.setDate(genderDate.getDate() + 30);

    const genderInvite = await Invitation.create({
      user: demoUser._id,
      title: 'Boots or Bows? Maya & Lucas Baby Reveal',
      slug: 'maya-lucas-gender-reveal',
      ceremonyType: 'gender_reveal',
      hostNames: 'Maya & Lucas Thorne',
      eventDate: genderDate,
      eventTime: '13:00',
      timezone: 'CET',
      venueName: 'Sunlit Willow Gardens',
      venueAddress: '78 Chemin du Moulin, Versailles',
      dressCode: 'Wear Team Pink (Bows) or Team Blue (Boots)!',
      dressCodeColors: ['#38BDF8', '#F472B6', '#FDE047', '#FFFFFF'],
      story: 'Our sweetest adventure is about to begin! Is it a little boy or a little girl? Join us for games, treats, and the big magical smoke reveal.',
      coverImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80',
      theme: {
        id: 'dusty-rose',
        primaryColor: '#B86B77',
        accentColor: '#78A1BB',
        bgColor: '#FBF4F2',
        textColor: '#2D2A26',
        fontFamily: 'sans',
        envelopeColor: '#F7ECE9'
      },
      schedule: [
        { time: '13:00', title: 'Arrival & Welcome Drinks', description: 'Pink berry lemonade & blue curacao mocktails.', icon: 'glass' },
        { time: '14:00', title: 'Cast Your Guess & Games', description: 'Vote Team Boy or Team Girl on the chalkboard!', icon: 'heart' },
        { time: '15:15', title: 'The Grand Smoke Cannon Reveal!', description: '3... 2... 1... The countdown to the big reveal!', icon: 'sparkles' },
        { time: '15:45', title: 'Cupcakes, Treats & Hugs', description: 'Celebratory brunch desserts and photos.', icon: 'utensils' }
      ],
      settings: {
        allowPlusOnes: true,
        maxPlusOnes: 2,
        showWishesWall: true
      },
      status: 'published'
    });

    // 5. Create 30th Birthday Party
    const bdayDate = new Date();
    bdayDate.setDate(bdayDate.getDate() + 15);

    const bdayInvite = await Invitation.create({
      user: demoUser._id,
      title: "Liam's Dirty Thirty Neon Soirée",
      slug: 'liam-turns-30',
      ceremonyType: 'birthday',
      hostNames: 'Liam Vance',
      eventDate: bdayDate,
      eventTime: '21:00',
      venueName: 'Club Velvet Underground',
      venueAddress: '12 Rue de Lappe, Bastille, Paris',
      dressCode: 'Glamour, Neon Accents & Leather',
      dressCodeColors: ['#F43F5E', '#A855F7', '#EAB308', '#000000'],
      story: 'Saying farewell to my twenties in supreme style. Premium open bar, live electro synth beats, and good vibes till sunrise!',
      coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
      theme: {
        id: 'midnight-stars',
        primaryColor: '#E11D48',
        accentColor: '#8B5CF6',
        bgColor: '#030712',
        textColor: '#F9FAFB',
        fontFamily: 'sans',
        envelopeColor: '#111827'
      },
      schedule: [
        { time: '21:00', title: 'Red Carpet Entrance', description: 'Complimentary welcome shots and photo wall.', icon: 'sparkles' },
        { time: '22:30', title: 'Midnight Birthday Countdown & Toast', description: 'Champagne shower and sparklers.', icon: 'glass' },
        { time: '01:00', title: 'Late Night Gourmet Sliders & Tacos', description: 'Fuel for the dance floor.', icon: 'utensils' }
      ],
      settings: {
        allowPlusOnes: true,
        maxPlusOnes: 1,
        showWishesWall: true
      },
      status: 'published'
    });

    console.log('[Seed] Created 4 sample ceremony invitations.');

    // 6. Seed Realistic RSVPs for Wedding
    const weddingRsvps = [
      {
        invitation: weddingInvite._id,
        guestName: 'Claire & Julien Moreau',
        email: 'claire.moreau@email.com',
        phone: '+33 6 55 44 33 22',
        status: 'attending',
        plusOnes: 1,
        plusOneNames: ['Julien Moreau'],
        dietaryRestrictions: 'Vegetarian for Claire',
        wishesMessage: 'We are so emotional and happy for you both! Counting down every second to celebrate your magical love story in Chantilly!',
        songRequest: 'Fly Me to the Moon - Frank Sinatra'
      },
      {
        invitation: weddingInvite._id,
        guestName: 'Marc Antoine Laurent',
        email: 'marc.laurent@email.com',
        phone: '+33 6 11 22 33 44',
        status: 'attending',
        plusOnes: 0,
        dietaryRestrictions: 'None (foodie ready!)',
        wishesMessage: 'My dearest sister Sophia, seeing you so radiant brings tears to my eyes. Alexandre, welcome to the family brother!',
        songRequest: 'September - Earth, Wind & Fire'
      },
      {
        invitation: weddingInvite._id,
        guestName: 'Elena Rostova',
        email: 'elena.rostova@email.com',
        phone: '+44 7700 900123',
        status: 'attending',
        plusOnes: 1,
        plusOneNames: ['David Miller'],
        dietaryRestrictions: 'Gluten-free',
        wishesMessage: 'Flying in straight from London! Sending you both endless blessings, joy, and peace.',
        songRequest: 'L-O-V-E - Nat King Cole'
      },
      {
        invitation: weddingInvite._id,
        guestName: 'Prof. Henri Bernard',
        email: 'h.bernard@sorbonne.fr',
        status: 'declined',
        plusOnes: 0,
        wishesMessage: 'My warmest congratulations Alexandre & Sophia. Due to an academic conference abroad I cannot attend in person, but my heart is with you.'
      },
      {
        invitation: weddingInvite._id,
        guestName: 'Camille & Thomas Leroux',
        email: 'camille.leroux@outlook.com',
        status: 'attending',
        plusOnes: 2,
        plusOneNames: ['Thomas Leroux', 'Léo Leroux'],
        dietaryRestrictions: 'Halal for Thomas',
        wishesMessage: 'A fairy tale wedding for a fairy tale couple! We are honored to celebrate with you.'
      }
    ];

    // 7. Seed RSVPs for Graduation
    const gradRsvps = [
      {
        invitation: gradInvite._id,
        guestName: 'Dr. Sarah Alami',
        email: 's.alami@polytechnique.fr',
        status: 'attending',
        plusOnes: 1,
        dietaryRestrictions: 'None',
        wishesMessage: 'Phenomenal achievement Ethan! Your master thesis was exemplary. The future of tech is lucky to have you.'
      },
      {
        invitation: gradInvite._id,
        guestName: 'Lucas Martin (Coding Buddy)',
        email: 'lucas.code@gmail.com',
        status: 'attending',
        plusOnes: 1,
        wishesMessage: 'From debugging segmentation faults at 3 AM to graduation day! So proud of you bro!'
      },
      {
        invitation: gradInvite._id,
        guestName: 'Aunt Beatrice Brooks',
        email: 'b.brooks@heritage.com',
        status: 'attending',
        plusOnes: 0,
        wishesMessage: 'The first engineer in the family! Ethan, your grandfather would have been so proud today.'
      }
    ];

    // 8. Seed RSVPs for Gender Reveal
    const genderRsvps = [
      {
        invitation: genderInvite._id,
        guestName: 'Grandma Rosa Thorne',
        email: 'rosa.thorne@family.com',
        status: 'attending',
        plusOnes: 1,
        wishesMessage: 'I am wearing pink because I have a strong feeling it is a baby girl! Cannot wait!'
      },
      {
        invitation: genderInvite._id,
        guestName: 'Dave & Chloe Vance',
        email: 'dave.v@gmail.com',
        status: 'attending',
        plusOnes: 1,
        wishesMessage: 'Team Blue all the way! Bring on the little slugger!'
      }
    ];

    await Rsvp.insertMany([...weddingRsvps, ...gradRsvps, ...genderRsvps]);
    console.log('[Seed] Inserted 10 sample RSVPs with wishes, plus-ones and dietary preferences.');

    console.log('=========================================');
    console.log(' SUCCESS: Database seeded completely!');
    console.log(' Demo Login: demo@celebria.com');
    console.log(' Password:   Password123!');
    console.log(' Sample URLs:');
    console.log('   /invite/sophia-alexandre-wedding');
    console.log('   /invite/ethan-brooks-graduation-2026');
    console.log('   /invite/maya-lucas-gender-reveal');
    console.log('   /invite/liam-turns-30');
    console.log('=========================================');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDB();
