// // src/services/api.ts

// // Define the type for a single post
// export interface Post {
//   userId: number;
//   id: number;
//   title: string;
//   body: string;
// }

// // Define the type for the paginated response
// export interface PaginatedResponse {
//   data: Post[];
//   totalRecords: number;
// }

// const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// export const fetchPosts = async (page: number, limit: number): Promise<PaginatedResponse> => {
//   // JSONPlaceholder API provides pagination via _page and _limit query params
//   const response = await fetch(`${API_URL}?_page=${page}&_limit=${limit}`);

//   if (!response.ok) {
//     throw new Error('Failed to fetch data');
//   }

//   // The total count is returned in the 'x-total-count' header
//   const totalRecords = parseInt(response.headers.get('x-total-count') || '0', 10);
//   const data: Post[] = await response.json();

//   return { data, totalRecords };
// };


// src/services/api.ts

// 1. New interface for an Artwork, including the fields you want
export interface Artwork {
  id: number;
  title: string;
  place_of_origin: string | null; // Can be null
  artist_display: string;
  inscriptions: string | null;    // Can be null
  date_start: number;
  date_end: number;
}

// Interface for the overall API response structure
interface ApiResponse {
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
  data: Artwork[];
}

// Interface for what our function will return
export interface PaginatedResponse {
  data: Artwork[];
  totalRecords: number;
}

// 2. API URL updated
const API_URL = 'https://api.artic.edu/api/v1/artworks';

// 3. The fetching function is updated for the new API
export const fetchArtworks = async (page: number, limit: number): Promise<PaginatedResponse> => {
  // We specify which fields we want the API to return - this is much more efficient!
  const fields = 'id,title,place_of_origin,artist_display,inscriptions,date_start,date_end';
  
  const response = await fetch(`${API_URL}?page=${page}&limit=${limit}&fields=${fields}`);

  if (!response.ok) {
    throw new Error('Failed to fetch data from the Art Institute of Chicago API');
  }

  const responseData: ApiResponse = await response.json();

  // 4. Get total records from the pagination object and data from the data array
  return {
    data: responseData.data,
    totalRecords: responseData.pagination.total
  };
};