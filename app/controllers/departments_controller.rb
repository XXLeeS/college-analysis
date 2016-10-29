class DepartmentsController < ApplicationController
	def enemy
		@departments = Dep105.all

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

	def get_nodes
		@nodes = File.read('app/assets/javascripts/nodes105.json')
		respond_to do |format|
		    format.json { render json: @nodes }
		end
	end

	def get_links
		@links = File.read('app/assets/javascripts/links105.json')
		respond_to do |format|
		    format.json { render json: @links }
		end
	end

	def force
		@departments = Dep105.all

		respond_to do |format|
			format.html
			format.json { render json: @departments }
		end
	end
end
