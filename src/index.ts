import express from 'express';
import { HttpError } from './application-error';
import { PokemonService } from './pokemon-service';

const app = express();
app.use(express.json());

const pokemonService = new PokemonService();

app.post('/pokemon', async (req, res) => {
  try {
    const pokemon = await pokemonService.addPokemon(req.body);
    res.status(201).json(pokemon);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.code).json({ error: error.message });
    }
    res.status(500).json(error);
  }
});

app.get('/pokemon/:id', async (req, res) => {
  try {
    const pokemon = await pokemonService.showPokemon(req.params.id);
    res.status(200).json(pokemon);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.code).json({ error: error.message });
    }
    res.status(500).json(error);
  }
});

app.put('/pokemon/:id', async (req, res) => {
  try {
    const pokemon = await pokemonService.updatePokemon(req.params.id, req.body);
    res.status(200).json(pokemon);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.code).json({ error: error.message });
    }
    res.status(500).json(error);
  }
});

app.delete('/pokemon/:id', async (req, res) => {
  try {
    const pokemon = await pokemonService.removePokemon(req.params.id);
    res.status(204).json(pokemon);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.code).json({ error: error.message });
    }
    res.status(500).json(error);
  }
});

app.listen(3000, () => {
  console.log(`⚡ Server started on http://localhost:3000`);
});