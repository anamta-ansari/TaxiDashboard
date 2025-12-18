'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { Button } from '../../Components/ui/Button';
import { CircleUser } from "lucide-react";
import router from 'next/router';


// =====================================================



// =====================================================
// FINAL PAGE → ONLY ONE EXPORT
// =====================================================

export default function ALLUSERS() {
  const router = useRouter();
  const user: User[] = [
    { id: '1', name: 'Ethan Clark', email: 'ethan.clark@adminexample.com', phone: '+1234567890', role: 'user', status: 'active', createdAt: '2025-01-23 11:22:04 AM' },
    { id: '2', name: 'Daniel Taylor', email: 'daniel.taylor@adminexample.com', phone: '+1234567891', role: 'user', status: 'active', createdAt: '2025-01-23 11:21:29 AM' },
    { id: '3', name: 'John Anderson', email: 'john.anderson@adminexample.com', phone: '+1234567892', role: 'user', status: 'active', createdAt: '2025-01-23 11:20:36 AM' },
    { id: '4', name: 'Emily Davis', email: 'emily.davis@adminexample.com', phone: '+1234567893', role: 'user', status: 'active', createdAt: '2025-01-23 11:20:00 AM' },
    { id: '5', name: 'Mia Walker', email: 'mia.walker@adminexample.com', phone: '+1234567894', role: 'user', status: 'active', createdAt: '2025-01-23 11:19:21 AM' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Users</h1>

              <Button
                variant="primary"
                onClick={() => router.push('/users/add-user')}
                className="flex items-center gap-2 sm:hidden"
              >
                <span>+</span> Add New
              </Button>
            </div>

            <div className="flex gap-2 sm:gap-2 sm:items-center sm:flex-row flex-row sm:justify-end justify-between">


              <Button
                variant="primary"
                onClick={() => router.push('/users/add-user')}
                className="hidden sm:flex items-center gap-2"
              >
                <span>+</span> Add New
              </Button>

              <Button variant="secondary">
                <span>↓</span> Export
              </Button>

              <Button variant="secondary">
                <span>↑</span> Import
              </Button>
            </div>
          </div>


          <div className="flex gap-4 text-sm border-b">
            <button className="pb-2 border-b-2 border-blue-600 text-blue-600 font-medium">
              All ({user.length})
            </button>
            <button className="pb-2 text-gray-600 hover:text-gray-800">
              Active ({user.length})
            </button>
            <button className="pb-2 text-gray-600 hover:text-gray-800">
              Deactive (0)
            </button>
            <button className="pb-2 text-gray-600 hover:text-gray-800">
              Trash (0)
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center gap-4 px-1 py-3 border-b">
            <select className="border rounded px-1 py-1 text-sm">
              <option>15</option>
              <option>25</option>
              <option>50</option>
            </select>

            <select className=" border rounded px-1 py-1 text-sm">
              <option>Bulk actions</option>
            </select>

            <button className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              Apply
            </button>

            <div className="hidden ml-auto sm:flex items-center gap-2">
              <input
                type="search"
                placeholder="Search"
                className="border rounded px-3 py-1 text-sm"
              />
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>

          {/* TABLE BODY */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role </th>
                  {/* <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status ▼</th> */}
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created At </th>
                </tr>
              </thead>

              <tbody>
                {user.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded" />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                          <CircleUser className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                        </div>

                        <div>
                          <div className=" text-gray-900">{u.name}</div>
                          <div className="flex gap-2 text-sm">
                            <button className="text-blue-600 text-[12px] hover:underline">Edit</button>
                            <span className="text-gray-400">|</span>
                            <button className="text-red-600 text-[12px] hover:underline">Move To Trash</button>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-700">{u.email}</td>
                    <td className="px-4 py-3 text-gray-700">{u.role}</td>

                    {/* <td className="px-4 py-3">
        <span
          className={`inline-block w-3 h-3  bg-gray-500 rounded-full ${
            u.status === "active" ? "bg-green-500" : "bg-gray-400"
          }`}
        ></span>
      </td> */}

                    <td className="px-4 py-3 text-gray-700">{u.createdAt}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          <div className="flex justify-between items-center px-4 py-3 border-t">
            <div className="text-sm text-gray-600">{user.length} Items</div>
          </div>
        </div>

      </div>
    </div>
  );
}
