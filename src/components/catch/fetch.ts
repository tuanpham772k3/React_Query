import { useQuery } from "@tanstack/react-query"
import { KEY_QUERY } from "./key"
const LIMIT = 6


export const useFetchUser = (currentPage: number) => {
    const fetchUser = useQuery({
        queryKey: KEY_QUERY.key_query(currentPage),
        queryFn: () =>
            fetch(
                `http://localhost:8000/users?_page=${currentPage}&_limit=${LIMIT}`
            ).then(async (res) => {
                //tong so nguoi dung
                const total_user = +(res.headers?.get("X-Total-Count") ?? 0);
                const limit = LIMIT
                //tong so trang
                const totalPa = total_user == 0 ? 0 : Math.ceil(total_user / limit);

                const data = await res.json();
                return { data: data, total_user, totalPa }
            }),
        staleTime: 3000,// Dữ liệu sẽ được coi là "tươi mới" trong 3 giây
        refetchOnWindowFocus: false,// Không tự động gọi lại khi người dùng quay lại tab
    });
    return {
        ...fetchUser,
        totalUser: fetchUser.data?.total_user ?? 0,
        totalPa: fetchUser.data?.totalPa ?? 0,
        data: fetchUser.data?.data ?? [],

    }

}