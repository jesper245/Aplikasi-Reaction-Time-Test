'use client';

import { BestScore, User } from '@prisma/client'

interface LeaderboardsProps {
  leaderboards: (BestScore & {
    user: {
      username: string;
    };
  })[];
}

export default function Leaderboards(props: LeaderboardsProps) {
  if (props.leaderboards.length == 0) {
    return <></>;
  }

  return (
    <>
      <div className="flex items-center justify-center my-5">
        <h1 className="text-xl font-bold">Leaderboard</h1>
      </div>
      <div className="max-w-xl mx-auto overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Best Time (seconds)</th>
            </tr>
          </thead>
          <tbody>
            {/* row */}
            {props.leaderboards.map((leaderboard, index) => {
              return (
                <tr key={leaderboard.id}>
                  <th>{index + 1}</th>
                  <td>{leaderboard.user.username}</td>
                  <td>{(Number(leaderboard.timeTaken) / 1000).toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}