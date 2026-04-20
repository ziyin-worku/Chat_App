import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { getAuthUser } from '../lib/api.js';

const useAuthUser = () => {
 const authUser = useQuery({
   queryKey: ["authUser"],

   queryFn: getAuthUser,
   retry: false, // auth checking, as we don't want to retry if the user is not authenticated
 });

return {isLoading: authUser.isLoading, authUser: authUser.data?.user}}

export default useAuthUser