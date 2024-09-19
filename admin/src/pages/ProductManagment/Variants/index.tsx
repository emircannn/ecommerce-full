/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react"
import Groups from "./Groups"
import Options from "./Options"
import request from "@/utils/request"
import { VariantGroupsProps } from "@/types"

const Variants = () => {

    const [groups, setGroups] = useState<VariantGroupsProps[]>([])
    const [selectedGroups, setSelectedGroups] = useState<VariantGroupsProps>()
    const [groupLoading, setGroupLoading] = useState(true)
    const [optionLoading, setOptionLoading] = useState(true)
    const getGroups = useCallback(async() => {
        try {
            setGroupLoading(true)
            const res = await request({url: '/variations/get-groups', method: 'get'})
            setGroups(res.data)
        } catch (error:any) {
            throw new Error(error)
        } finally {
            setGroupLoading(false)
        }
    }, [])

    useEffect(() => {
        getGroups()
    }, [getGroups])

    useEffect(() => {
      if(groups.length > 0) {
        setSelectedGroups(groups[0])
      }
    }, [groups])

    const [options, setOptions] = useState<{id: string, value:string}[]>([])

    const getOptions = useCallback(async() => {
        try {
            setOptionLoading(true)
            if(selectedGroups) {
                const res = await request({url: `/variations/get-options?id=${selectedGroups.id}`, method: 'get'})
                setOptions(res.data)
            }
        } catch (error:any) {
            throw new Error(error)
        } finally {
            setOptionLoading(false)
        }
    }, [selectedGroups])

    useEffect(() => {
        getOptions()
    }, [getOptions])
    

  return (
        <div className="grid grid-cols-2 gap-5 px-20 h-full">
            <Groups
                groups={groups}
                selectedGroups={selectedGroups}
                setSelectedGroups={setSelectedGroups}
                getData={getGroups}
                loading={groupLoading}
            />
            <Options
                options={options}
                getData={getOptions}
                loading={optionLoading}
                group_id={selectedGroups?.id}
            />
        </div>
  )
}

export default Variants