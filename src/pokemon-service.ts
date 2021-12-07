import { randomUUID } from 'crypto'
import { HTTP, HttpError } from './application-error';
import { prismaClient } from './prisma-client'

export type Pokemon = {
  id?: string;
  name: string;
  hp: number;
  attack: number;
  defense: number;
}

export class PokemonService {
  async addPokemon(pokemon: Pokemon): Promise<Pokemon> {
    const requiredFields = ['name', 'hp', 'attack', 'defense'];
    for (const field of requiredFields) {
      if (!pokemon[field as 'name' | 'hp' | 'attack' | 'defense']) {
        throw new HttpError(`${field} is required`, HTTP.BAD_REQUEST);
      }
    }
    if (!pokemon['name'] || !pokemon['hp'] || !pokemon['attack'] || !pokemon['defense']) {
      throw new HttpError('Pokemon not found', HTTP.NOT_FOUND);
    }
    const createdPokemon = await prismaClient.pokemon.create({
      data: {
        id: randomUUID(),
        ...pokemon
      }
    });
    return createdPokemon;
  }

  async showPokemon(id: string): Promise<Pokemon> {
    const pokemon = await prismaClient.pokemon.findUnique({
      where: {
        id
      }
    });
    if (!pokemon) throw new HttpError('Pokemon not found', HTTP.NOT_FOUND);
    return pokemon;
  }

  async updatePokemon(id: string, pokemon: Pokemon): Promise<Pokemon> {
    const foundPokemon = await prismaClient.pokemon.findUnique({
      where: {
        id
      }
    });
    if (!foundPokemon) throw new HttpError('Pokemon not found', HTTP.NOT_FOUND);
    const updatedPokemon = await prismaClient.pokemon.update({
      where: {
        id
      },
      data: {
        name: pokemon.name,
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense
      }
    });
    return updatedPokemon;
  }

  async removePokemon(id: string): Promise<void> {
    const foundPokemon = await prismaClient.pokemon.findUnique({
      where: {
        id
      }
    });
    if (!foundPokemon) throw new HttpError('Pokemon not found', HTTP.NOT_FOUND);
    await prismaClient.pokemon.delete({
      where: { id }
    });
  }
}