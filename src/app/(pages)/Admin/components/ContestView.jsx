'use client'
import CreateContestDialog from '@/components/organisms/CreateContestDialog'
import React, { useEffect, useState } from 'react'
import CrudView from './CrudView'
import { useRouter } from 'next/navigation'
import { useContestStore } from '@/store/useContestStore'
import SkeletonUI from '@/components/atoms/Loader'
const ContestView = () => {

  const { fetchContests, fetchContestById, contests, contest, deleteContest } = useContestStore();
  useEffect(() => {
    (async () => {
      await fetchContests();
    })()
  }, [])
  const [open, setOpen] = useState(false);
  const navigate = useRouter();
  const AddContest = () => {
    setOpen(true);
  }

  const columns = [{ key: 'title', label: 'Title' }, { key: 'startTime', label: 'Start Time' }, { key: 'endTime', label: 'End Time' }, { key: 'status', label: 'Status', render: (item) => <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'Live' ? 'bg-red-500/50 text-red-300' : item.status === 'Upcoming' ? 'bg-yellow-500/50 text-yellow-300' : 'bg-gray-500/50 text-gray-300'}`}>{item.status}</span> }]

  if (contests?.length == 0) {
    return <SkeletonUI />
  }

  const [isDeleting, setisDeleting] = useState(false)
  const [deletedid, setdeletedid] = useState(null)
  const handledelete = (item) => {
    setisDeleting(p => !p)
    setdeletedid(item.id);
  }

  return (
    <div>
      <CrudView title="Manage Contests" data={contests} columns={columns} onAddItem={AddContest} handledelete={handledelete} isDeleting={isDeleting} setisDeleting={setisDeleting} deletedid={deletedid} onDeleteConfirm={deleteContest} />;

      <div>
        {open && <CreateContestDialog setOpen={setOpen} />}
      </div>
    </div>
  )
}

export default ContestView
