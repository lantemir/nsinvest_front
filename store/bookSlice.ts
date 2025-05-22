import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axios";


interface Book {  
  id: number;
  title: string;
  category: string
  description: string;
  file: string;
  cover: string | null;
  created_at: string;
}

interface BookState{
    books: Book[];    
    currentBook: Book | null;
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;    
}

const initialState: BookState = {
    books: [],    
    currentBook: null,
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
}

export const fetchBooks = createAsyncThunk(
    "books/fetchingBooks",
    async(
        { page = 1, category_id}: { page?: number, category_id?: string},
        thunkAPI
    ) => {
        try {
            const response = await api.get (
                `/api/book/get-book/?category_id=${category_id}&page=${page}`              
            );
            return {
                data: response.data.results,
                totalPages: Math.ceil(response.data.count/response.data.page_size),
                currentPage: page,
            };
        }catch(error:any){
            return thunkAPI.rejectWithValue("Не удалось загрузить книги")
        }
    }
)

// export const fetchBooksByCategory = createAsyncThunk(
//     "books/fetchingBooksByCategory",
//     async(
//         {id, page=1}:{id: number, page: number},
//         thunkAPI
//     ) => {
//         try {
//             const response = await api.get (
//                 `/api/book/get-book-by-category/`
//             );
//             return {
//                 data: response.data.results,
//                 totalPages: Math.ceil(response.data.count/response.data.page_size),
//                 currentPage: page
//             }
//         }catch(error:any){
//             return thunkAPI.rejectWithValue("Не удалось загрузить книги по категории")
//         }
//     }
// )

// export const fetchInterestingByCategory = createAsyncThunk(
//     "interesting/fetchInteresting",
//     async(
//         {categoryId, page = 1, search = ""}: {categoryId: number; page?: number; search?: string},
//         thunkAPI
//     ) => {
//         try {
//             const response = await api.get(
//                 `/api/interesting/by-category/${categoryId}/?page=${page}&search=${search}`
//             );
//             console.log("fetchInteresting@@@" , response)
//             return{
//                 data: response.data.results,
//                 totalPages: Math.ceil(response.data.count/response.data.page_size),
//                 currentPage: page,
//             };
//         }catch(erroe:any){
//             console.log("fetchCoursesByCategory@@@" , "Не удалось загрузить курсы")
//             return thunkAPI.rejectWithValue("Не удалось загрузить курсы")
//         }
//     }
// )

// export const fetchInterestingById = createAsyncThunk(
//     "interesting/fetchInterestingById",
//     async(
//         {id}:{id:number},
//         thunkAPI
//     ) => {
//         try {
//             const response = await api.get(
//                 `/api/interesting/by-id/${id}`
//             );
//             console.log("fetchInterestingById_response", response.data)
//             return {
//                 data: response.data,
//             }

//         }catch(error:any){
//             console.log("fetchInterestingById", "Не отработал fetchInterestingById")
//             return thunkAPI.rejectWithValue("Не удалось загрузить interesting")
//         }
//     }
// ) 

const bookSlice = createSlice({
    name: "books",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBooks.fulfilled, (state, action)=> {
                state.loading= false;
                state.error= null;
                state.books = action.payload.data
                state.totalPages = action.payload.totalPages
                state.currentPage = action.payload.currentPage
            })
            .addCase(fetchBooks.rejected, (state, action)=> {
                state.loading=false;
                state.error=action.payload as string;
                state.books = [];
                state.totalPages= 1;
                state.currentPage= 1;

            })
            // .addCase(fetchBooksByCategory.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(fetchBooksByCategory.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.error = null;
            //     state.books = action.payload.data
            //     state.totalPages = action.payload.totalPages
            //     state.currentPage = action.payload.currentPage
            // })
            // .addCase(fetchBooksByCategory.rejected, (state, action)=> {
            //     state.loading=false;
            //     state.error=action.payload as string;
            // })
            
    }
});
export default bookSlice.reducer