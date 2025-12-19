'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

interface Booking {
  id: string;
  date: string;
  time: string;
  taxiCompany: string;
  from: string;
  to: string;
  payment: string;
  amount: string;
  status: string;
}

export default function History() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'prebooking' | 'completed' | 'cancelled'>('in-progress');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  const filteredBookings = activeTab === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === activeTab);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Booking History
        </h1>

        <Link
          href="/book-trip"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-medium"
        >
          New Booking
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-col-2 sm:flex gap-8 border-b mb-4 text-sm font-medium">
        <button 
          onClick={() => setActiveTab('all')}
          className={`pb-3 ${activeTab === 'all' ? 'text-gray-800 border-b-2 border-orange-500' : 'text-gray-400'}`}
        >
          All Trips
        </button>
        <button 
          onClick={() => setActiveTab('in-progress')}
          className={`pb-3 ${activeTab === 'in-progress' ? 'text-gray-800 border-b-2 border-orange-500' : 'text-gray-400'}`}
        >
          In Progress
        </button>
        <button 
          onClick={() => setActiveTab('prebooking')}
          className={`pb-3 hidden sm:block ${activeTab === 'prebooking' ? 'text-gray-800 border-b-2 border-orange-500' : 'text-gray-400'}`}
        >
          Prebookings
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`pb-3 hidden sm:block ${activeTab === 'completed' ? 'text-gray-800 border-b-2 border-orange-500' : 'text-gray-400'}`}
        >
          Completed
        </button>
        <button 
          onClick={() => setActiveTab('cancelled')}
          className={`pb-3 hidden sm:block ${activeTab === 'cancelled' ? 'text-gray-800 border-b-2 border-orange-500' : 'text-gray-400'}`}
        >
          Cancelled
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-gray-400 border-b">
              <th className="py-4 px-2 text-left font-medium">Date</th>
              <th className="py-4 px-2 text-left font-medium">Time</th>
              <th className="py-4 px-2 text-left font-medium">Taxi Company</th>
              <th className="py-4 px-2 text-left font-medium">From</th>
              <th className="py-4 px-2 text-left font-medium">To</th>
              <th className="py-4 px-2 text-left font-medium">Payment</th>
              <th className="py-4 px-2 text-right font-medium">Amount</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-gray-500 border-b"
                >
                  No data available
                </td>
              </tr>
            ) : (
              filteredBookings.slice(0, itemsPerPage).map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-2 text-sm text-gray-800">{booking.date}</td>
                  <td className="py-4 px-2 text-sm text-gray-800">{booking.time}</td>
                  <td className="py-4 px-2 text-sm text-gray-800">{booking.taxiCompany}</td>
                  <td className="py-4 px-2 text-sm text-gray-600 max-w-[200px] truncate" title={booking.from}>
                    {booking.from}
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-600 max-w-[200px] truncate" title={booking.to}>
                    {booking.to}
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-800">{booking.payment}</td>
                  <td className="py-4 px-2 text-sm text-gray-800 text-right font-medium">{booking.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          Items per page:
          <button 
            onClick={() => setItemsPerPage(10)}
            className={`font-medium ${itemsPerPage === 10 ? 'text-gray-800' : 'text-gray-500'}`}
          >
            10
          </button>
          <button 
            onClick={() => setItemsPerPage(20)}
            className={`font-medium ${itemsPerPage === 20 ? 'text-gray-800' : 'text-gray-500'}`}
          >
            20
          </button>
          <button 
            onClick={() => setItemsPerPage(30)}
            className={`font-medium ${itemsPerPage === 30 ? 'text-gray-800' : 'text-gray-500'}`}
          >
            30
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded hover:bg-gray-100">‹</button>
          <button className="p-2 rounded hover:bg-gray-100">›</button>
        </div>
      </div>
    </div>
  );
}
