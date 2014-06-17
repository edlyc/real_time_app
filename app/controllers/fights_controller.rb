class FightsController < ApplicationController
  def index
  end

  def show
    @song = ['pokemusic.mp3', 'pokemusic2.mp3'].sample
  end
end
