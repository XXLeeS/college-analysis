Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  root to: 'welcome#index'
  get '/about' => 'welcome#about'
  get '/change_year/:new_year' => 'application#change_year', as: 'change_year'

  scope '/:year', defaults: { year: '105' } do
    resources :departments, only: [:index, :show], defaults: { format: 'html' } do
      collection do
        post :search
      end
    end
    get '/' => 'welcome#index'
    get '/colleges/:id' => 'departments#show_college', as: "college"

    get '/get_nodes' => 'departments#get_nodes', defaults: { format: 'json' }
    get '/get_links' => 'departments#get_links', defaults: { format: 'json' }
    get '/force' => 'departments#force'

   resources :ranks, only: [:index, :show], defaults: { format: 'html' }
  end

  
end
