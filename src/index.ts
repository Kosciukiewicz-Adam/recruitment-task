import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { TmbdApi } from "./tmpdApi";
import { PdfManager } from "./pdfManager";
import { moviesListNames } from "./consts";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/movies", async (req: Request, res: Response) => {
    const { data, status } = await TmbdApi.fetchMoviesList(moviesListNames.POPULAR);

    if (status !== 200) {
        res.status(404).send("Error 404 - cannot find");
        return;
    }

    await PdfManager.createMoviesList(data, () => {
        const pdfFile = PdfManager.getMoviesList();
        res.contentType("application/pdf");
        res.status(200).send(pdfFile);
    });
});

app.get('/movies/:movieId', async (req: Request, res: Response) => {
    const { movieId } = req.params;
    const { data, status } = await TmbdApi.fetchMovie(movieId);

    if (status !== 200) {
        res.status(404).send("Error 404 - movie does not exist");
        return;
    }

    await PdfManager.createMoviePage(data, () => {
        const pdfFile = PdfManager.getMoviePage(data.id);
        res.contentType("application/pdf");
        res.status(200).send(pdfFile);
    });
});

app.get('*', (req, res) => {
    res.status(404).send("Error 404 - cannot find");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});