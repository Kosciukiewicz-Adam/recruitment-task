import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { TmbdApi } from "./tmpdApi";
import { PdfManager } from "./pdfManager";
import { moviesListNames } from "./consts";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Movie pdf generator, for movies use /movies and for specyfic movie use /movies/:movie_id");
});

app.get("/movies", async (req: Request, res: Response) => {
    const moviesListData = await TmbdApi.fetchMoviesList(moviesListNames.POPULAR);
    await PdfManager.createMoviesList(moviesListData, () => {
        const pdfFile = PdfManager.getMoviesList();
        res.contentType("application/pdf");
        res.send(pdfFile);
    });
});

app.get('/movies/:movieId', async (req: Request, res: Response) => {
    const { movieId } = req.params;
    const moviesData = await TmbdApi.fetchMovie(movieId);
    await PdfManager.createMoviePage(moviesData, () => {
        const pdfFile = PdfManager.getMoviePage(movieId);
        res.contentType("application/pdf");
        res.send(pdfFile);
    });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});