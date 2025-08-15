    import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
    import api from "@/utils/axios";
    import { stat } from "fs";

    interface Interesting {  
    id: number;
    title: string;
    category: string
    content: string;
    video: string;
    created_at: string | null;
    cover: string;
    }

    interface LessonState{
        interesting: Interesting[];
        interest:Interesting | null;
        currentInteresting: Interesting | null;
        loading: boolean;
        error: string | null;
        totalPages: number;
        currentPage: number;    
    }

    const initialState: LessonState = {
        interesting: [],
        interest: null,
        currentInteresting: null,
        loading: false,
        error: null,
        totalPages: 1,
        currentPage: 1,
    }

    export const fetchInterestingByCategory = createAsyncThunk(
        "interesting/fetchInteresting",
        async(
            {categoryId, page = 1, search = ""}: {categoryId: number; page?: number; search?: string},
            thunkAPI
        ) => {
            try {
                const response = await api.get(
                    `/api/interesting/by-category/${categoryId}/?page=${page}&search=${search}`
                );
                
                return{
                    data: response.data.results,
                    totalPages: Math.ceil(response.data.count/response.data.page_size),
                    currentPage: page,
                };
            }catch(erroe:any){
                console.log("fetchCoursesByCategory@@@" , "Не удалось загрузить курсы")
                return thunkAPI.rejectWithValue("Не удалось загрузить курсы")
            }
        }
    )

    export const fetchInterestingById = createAsyncThunk(
        "interesting/fetchInterestingById",
        async(
            {id}:{id:number},
            thunkAPI
        ) => {
            try {
                const response = await api.get(
                    `/api/interesting/by-id/${id}`
                );
                console.log("fetchInterestingById_response", response.data)
                return {
                    data: response.data,
                }

            }catch(error:any){
                console.log("fetchInterestingById", "Не отработал fetchInterestingById")
                return thunkAPI.rejectWithValue("Не удалось загрузить interesting")
            }
        }
    ) 

    const courseSlice = createSlice({
        name: "interesting",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(fetchInterestingByCategory.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetchInterestingByCategory.fulfilled, (state, action)=> {
                    state.loading= false;
                    state.error= null;
                    state.interesting = action.payload.data
                    state.totalPages = action.payload.totalPages
                    state.currentPage = action.payload.currentPage
                })
                .addCase(fetchInterestingByCategory.rejected, (state, action)=> {
                    state.loading=false;
                    state.error=action.payload as string;
                })
                .addCase(fetchInterestingById.fulfilled, (state, action) => {
                    state.loading=false;
                    state.interest = action.payload.data
                })
                .addCase(fetchInterestingById.rejected, (state, action)=> {
                    state.loading=false;
                    state.error=action.payload as string;
                })
        }
    });
    export default courseSlice.reducer