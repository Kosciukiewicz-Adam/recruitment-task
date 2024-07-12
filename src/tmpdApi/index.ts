import dotenv from "dotenv";
import { httpMethodsNames } from "../consts";
import { Movie } from "../pdfManager";

dotenv.config();

const fetch = require('node-fetch');

export class TmbdApi {
    private static getApiUrl = (param?: string): string => {
        const extraParam = param ? `/${param}` : "";
        return `${process.env.ENDPOINT}${extraParam}?api_key=${process.env.API_KEY}`;
    }

    public static getPosterUrl = (posterFileName: string): string => {
        return `https://image.tmdb.org/t/p/w500/${posterFileName}`
    }

    public static fetchMoviesList = async (listType: string): Promise<Movie[]> => {
        const response = await fetch(this.getApiUrl(listType), { method: httpMethodsNames.GET });
        const data = await response.json();

        return data.results;
    }

    public static fetchMovie = async (movieId: string): Promise<Movie> => {
        const response = await fetch(this.getApiUrl(movieId), { method: httpMethodsNames.GET });
        return await response.json();
    }
}