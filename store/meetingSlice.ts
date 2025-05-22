import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axios";
import { Interface } from "readline";
import reducer from "./authSlice";

export interface Meeting {
    id: number
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    youtubeLink: string; 
    zoomLink: string;
    description: string;
}

interface MeetingState {
    meetings: Meeting [];
    curentMeeting: Meeting | null;
    loading: boolean;
    error: string | null;
    
}

const initialState: MeetingState = {
    meetings: [],
    curentMeeting: null,
    loading: false,
    error: null

}

export const fetchMeeting = createAsyncThunk(
    "meeting/fetchingMeeting",
    async(_, thunkAPI) => {
        try{
            const response = await api.get(`/api/meeting/get-meeting/`);

            const normalizedData = response.data.map((item: any) => ({
                id: item.id,
                title: item.title,
                date: item.date,
                startTime: item.start_time,
                endTime: item.end_time,
                youtubeLink: item.youtube_link,
                zoomLink: item.zoom_link,
                description: item.description
              }));
              
            return {
                data: normalizedData
            }

        }catch(error:any){
            thunkAPI.rejectWithValue("нет ответа от сервера")
        }
    }
)

const meetingSlice = createSlice({
    name: "meeting",
    initialState,
    reducers: {},
    extraReducers: (builder)=> {
        builder
        .addCase(fetchMeeting.pending, (state)=> {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchMeeting.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.meetings = action?.payload?.data;
        })
        .addCase(fetchMeeting.rejected, (state, action) => {
            state.loading= false;
            state.error = action.payload as string;
            state.meetings = [];
        })
    }
});
export default meetingSlice.reducer


