Rails.application.routes.draw do
  resources :fights, only: [:show]
  root "fights#index"
end
