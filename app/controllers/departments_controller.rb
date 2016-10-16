class DepartmentsController < ApplicationController
	def enemy
		@departments = Dep105.all
		print @departments

		respond_to do |format|
			format.html
			format.json { render json: @departments }
		end
	end

	def enemy_submit
		@departments = Dep105.all
		dep = params[:dep_no]
		@results = Winrate105.where('dep = (?)', dep)

		render :enemy
	end
end
