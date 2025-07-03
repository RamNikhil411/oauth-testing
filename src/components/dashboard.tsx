import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { DocsColumns } from '../components/core/DocsColumns'
import TanStackTable from '../components/core/TanstackTable'
import { WorkspaceComboBox } from './core/workspacePopover'

export interface Workspace {
  _id: string
  name: string
  type: string
  status: string
  user_id: string
  application_theme: string
  created_at: Date
  updated_at: Date
  plan_type: string
  is_owner: boolean
  user_types: UserType[]
}

export interface UserType {
  user_type_id: string
  user_type_name: string
}

const Dashboard = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null,
  )
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const {
    data: workspaces,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token')
      if (!token) throw new Error('No access token found')

      const res = await fetch(
        `https://v2-dev-api.esigns.io/v1.0/api/workspaces/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!res.ok) {
        throw new Error('Failed to fetch user data')
      }

      return res.json()
    },
  })

  const company_id = selectedWorkspace?._id

  const {
    data: documentsData,
    isLoading: isDocsLoading,
    isFetching: isDocsFetching,
  } = useQuery({
    queryKey: ['documents', company_id, pageIndex, pageSize],
    queryFn: async () => {
      const token = localStorage.getItem('access_token')
      if (!token) throw new Error('No access token found')

      const res = await fetch(
        `https://v2-dev-api.esigns.io/v1.0/api/company-document-responses-v2?company_id=${company_id}&page=${
          pageIndex + 1
        }&limit=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!res.ok) {
        throw new Error('Failed to fetch documents')
      }

      return res.json()
    },
    enabled: !!company_id,
  })

  useEffect(() => {
    if(!selectedWorkspace){
      setSelectedWorkspace(workspaces?.data[0])
    }
  }, [workspaces])


  if (isLoading) return <p className="p-4">🔄 Loading...</p>
  if (isError) return <p className="p-4 text-red-600">❌ Error fetching user</p>

  const totalDocs = documentsData?.total || 0
  const pageCount = Math.ceil(totalDocs / pageSize)

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📄 Document List</h2>
        <WorkspaceComboBox
          allWorkspaces={workspaces?.data}
          selectedWorkspace={selectedWorkspace}
          setSelectedWorkspace={setSelectedWorkspace}
        />
      </div>
     <div className='relative'>
      <TanStackTable
        data={documentsData?.data || []}
        columns={DocsColumns}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={pageCount}
        onPageChange={setPageIndex}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize)
          setPageIndex(0)
        }}
        loading={isDocsLoading || isDocsFetching}
      />
      </div>
    </div>
  )
}

export default Dashboard
