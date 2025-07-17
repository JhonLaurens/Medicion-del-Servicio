import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { satisfactionDataService } from '../services/dataService';
import { SatisfactionRecord, KPIData, GeographicData, SuggestionData, TechnicalInfo } from '../types';

interface DataState {
  records: SatisfactionRecord[];
  kpiData: KPIData[];
  geographicData: GeographicData[];
  suggestionData: SuggestionData[];
  technicalInfo: TechnicalInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  records: [],
  kpiData: [],
  geographicData: [],
  suggestionData: [],
  technicalInfo: null,
  loading: false,
  error: null,
};

export const fetchData = createAsyncThunk('data/fetchData', async (_, { rejectWithValue }) => {
  try {
    await satisfactionDataService.loadData();
    const records = satisfactionDataService.getData();
    const kpiData = satisfactionDataService.getKPIData();
    const geographicData = satisfactionDataService.getCityData();
    const suggestionData = satisfactionDataService.getSuggestionData();
    const technicalInfo = satisfactionDataService.getTechnicalInfo();
    return { records, kpiData, geographicData, suggestionData, technicalInfo };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.records;
        state.kpiData = action.payload.kpiData;
        state.geographicData = action.payload.geographicData;
        state.suggestionData = action.payload.suggestionData;
        state.technicalInfo = action.payload.technicalInfo;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dataSlice.reducer;
