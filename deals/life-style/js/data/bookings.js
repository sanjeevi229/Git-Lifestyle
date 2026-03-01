// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Sample Bookings
// ══════════════════════════════════════════════

const SAMPLE_BOOKINGS = [
  {
    id: 'BKG-2026-10001', userId: 'USR-003', offerId: 'OFR-001', type: 'offer',
    status: 'confirmed', bookingDate: '2026-03-10', partySize: 2,
    specialRequests: 'Window table preferred',
    createdAt: '2026-02-20T14:30:00', confirmationCode: 'ENBD-XK9J2',
    statusHistory: [
      { status: 'pending', at: '2026-02-20T14:30:00', note: 'Booking submitted' },
      { status: 'confirmed', at: '2026-02-20T14:30:05', note: 'Auto-confirmed' },
    ],
  },
  {
    id: 'BKG-2026-10002', userId: 'USR-003', offerId: 'EVT-001', type: 'event',
    status: 'confirmed', bookingDate: '2026-03-15', partySize: 2,
    specialRequests: '',
    createdAt: '2026-02-18T09:15:00', confirmationCode: 'ENBD-MN4P8',
    statusHistory: [
      { status: 'pending', at: '2026-02-18T09:15:00', note: 'Booking submitted' },
      { status: 'confirmed', at: '2026-02-18T09:15:05', note: 'Auto-confirmed' },
    ],
  },
  {
    id: 'BKG-2026-10003', userId: 'USR-004', offerId: 'OFR-009', type: 'offer',
    status: 'completed', bookingDate: '2026-02-10', partySize: 1,
    specialRequests: 'Deep tissue massage preferred',
    createdAt: '2026-02-05T11:00:00', confirmationCode: 'ENBD-QR7T3',
    statusHistory: [
      { status: 'pending', at: '2026-02-05T11:00:00', note: 'Booking submitted' },
      { status: 'confirmed', at: '2026-02-05T11:00:05', note: 'Auto-confirmed' },
      { status: 'completed', at: '2026-02-10T17:00:00', note: 'Service completed' },
    ],
  },
  {
    id: 'BKG-2026-10004', userId: 'USR-002', offerId: 'OFR-003', type: 'offer',
    status: 'cancelled', bookingDate: '2026-02-15', partySize: 4,
    specialRequests: 'Outdoor seating',
    createdAt: '2026-02-12T16:45:00', confirmationCode: 'ENBD-AB2C9',
    statusHistory: [
      { status: 'pending', at: '2026-02-12T16:45:00', note: 'Booking submitted' },
      { status: 'confirmed', at: '2026-02-12T16:45:05', note: 'Auto-confirmed' },
      { status: 'cancelled', at: '2026-02-14T10:00:00', note: 'Cancelled by user' },
    ],
  },
  {
    id: 'BKG-2026-10005', userId: 'USR-005', offerId: 'OFR-017', type: 'offer',
    status: 'confirmed', bookingDate: '2026-04-25', partySize: 2,
    specialRequests: '',
    createdAt: '2026-02-22T08:30:00', confirmationCode: 'ENBD-ZW5L1',
    statusHistory: [
      { status: 'pending', at: '2026-02-22T08:30:00', note: 'Booking submitted' },
      { status: 'confirmed', at: '2026-02-22T08:30:05', note: 'Auto-confirmed' },
    ],
  },
];

window.SAMPLE_BOOKINGS = SAMPLE_BOOKINGS;
