import path from "path";
import { TmbdApi } from "../tmpdApi";

const PDFDocument = require('pdfkit');
const fetch = require("node-fetch");
const fs = require("fs");

export interface Movie {
    release_date: string;
    vote_average: number;
    poster_path: string;
    title: string;
    id: number;
}

export class PdfManager {
    private static getFilePath = (fileName: string) => {
        return path.join(__dirname, `../../public/${fileName}.pdf`);
    }

    private static getImagePath = (fileName: string) => {
        return path.join(__dirname, `../../public/${fileName}`);
    }

    private static downloadImage = async (fileName: string, callback: () => void) => {
        const image = await fetch(TmbdApi.getPosterUrl(fileName));
        const writeStream = fs.createWriteStream(this.getImagePath(fileName));
        image.body.pipe(writeStream);
        writeStream.on('finish', () => callback());
    }

    public static createMoviesList(data: Movie[], callback: () => void) {
        const newDoc = new PDFDocument;
        data.forEach(movie => {
            newDoc.text(movie.title, { link: `/movies/${movie.id}` });
            newDoc.text(movie.release_date);
            newDoc.text(movie.vote_average);
            newDoc.text("  ");
        })

        const writeStream = fs.createWriteStream(this.getFilePath("movies_list"))

        newDoc.pipe(writeStream);
        newDoc.end()

        writeStream.on('finish', () => callback());
    }

    public static async createMoviePage(movie: Movie, callback: () => void) {
        const newDoc = new PDFDocument;
        const posterName = movie?.poster_path.replace('/', '');

        newDoc.text(movie?.title);
        newDoc.text(movie?.release_date);
        newDoc.text(movie?.vote_average);
        await this.downloadImage(posterName, () => {
            newDoc.image(this.getImagePath(posterName), 100, 200, { width: 100 })

            const writeStream = fs.createWriteStream(this.getFilePath(`movie_${movie.id}`))
            newDoc.pipe(writeStream);
            newDoc.end()

            writeStream.on('finish', () => callback());
        });
    }

    public static getMoviesList() {
        return fs.readFileSync(this.getFilePath("movies_list"));
    }

    public static getMoviePage(movieId: number) {
        return fs.readFileSync(this.getFilePath(`movie_${movieId}`));
    }
}