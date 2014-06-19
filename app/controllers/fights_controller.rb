class FightsController < ApplicationController
  def index
    @song = ['pokemusic.mp3', 'pokemusic2.mp3'].sample
  end
end
