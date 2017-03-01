class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  def change_year
  	url = request.referrer.split('/')

    #http://domain.name/:year/...
  	url[3] = params[:new_year]
  	url = url.join('/')

		redirect_to url
		rescue ActionController::RedirectBackError
			redirect_to root_path
  end
end
