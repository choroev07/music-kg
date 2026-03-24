import {supabase} from "../supabase/index.js";
const userService = {
    getAllUsers: async () => {
        const {data, error} = await supabase.from('users').select('*');
        if (error) {
            console.error('Error fetching users:', error);
            return [];
        }
        return data;
    }
};
export const {getAllUsers} = userService;