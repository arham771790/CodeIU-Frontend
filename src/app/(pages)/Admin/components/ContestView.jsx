'use client'
import CreateContestDialog from '@/app/components/contest/CreateContestDialog'
import React, { useEffect, useState } from 'react'
import CrudView from './CrudView'
import { useRouter } from 'next/navigation'
import { useContestStore } from '@/app/store/useContestStore'
import SkeletonUI from '@/app/components/smallcomponents/SkeletonUI'
const ContestView = () => {

const {  fetchContests,  fetchContestById, contests,contest}=useContestStore();
useEffect(()=>{
  (async()=>{
    await  fetchContests();
  })()
},[])
    const navigate=useRouter();
      const AddContest=()=>{
        navigate.push('/Create-Contest')
    }

if(contests?.length==0){
  return <SkeletonUI/>
}

const columns=[{key: 'title', label: 'Title'}, {key: 'startTime', label: 'Start Time'}, {key: 'endTime', label: 'End Time'}, {key: 'status', label: 'Status', render: (item) => <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'Live' ? 'bg-red-500/50 text-red-300' : item.status === 'Upcoming' ? 'bg-yellow-500/50 text-yellow-300' : 'bg-gray-500/50 text-gray-300'}`}>{item.status}</span>}]
  return (
    <div>
     <CrudView title="Manage Contests" data={contests} columns={columns} onAddItem={AddContest} />;
    </div>
  )
}

export default ContestView
