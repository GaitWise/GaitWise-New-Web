import { User } from 'types'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import LabResultsList from '../participants/LabResultList'
import Profile from '../participants/Profile'

export function SideTabs({ labResults, matchedParticipant }: { labResults: Array<string>; matchedParticipant: User }) {
  console.log('matchedParticipant:', matchedParticipant)
  return (
    <Tabs defaultValue="matchedParticipant" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="matchedParticipant">Patient Profile</TabsTrigger>
        <TabsTrigger value="Results">Lab Results</TabsTrigger>
      </TabsList>
      <TabsContent value="matchedParticipant">
        <Card>
          <CardHeader className="flex justify-items-center">
            <CardTitle>Patient Profile</CardTitle>
            <CardDescription>Make changes to your account here. Click save when you're done.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Profile participant={matchedParticipant} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="Results">
        <Card>
          <CardHeader>
            <CardTitle>Lab Results</CardTitle>
            <CardDescription>View and manage lab results here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <LabResultsList labResults={labResults} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
