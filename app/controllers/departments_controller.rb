class DepartmentsController < ApplicationController
	def index
		@departments = Dep105.all.order(:dep_no)
		@colleges = College.all.order(:college_no)

		respond_to do |format|
			format.html
			format.json { render json: @departments }
		end
	end

	def search
		dep = params[:dep_no]

		redirect_to department_url(dep)
	end

	def show_college
		@college = College.find(params[:id])
		@departments = Dep105.where('college_no = (?)', @college.college_no)
	end

	def show
		@department = Dep105.find(params[:id])
		if @department.last > 0
			@last = "正取"
		elsif @department.last < 0
			@last = "備取" + (String(@department.last.abs) rescue nil)
		else
			@last = "無"
		end
	end

	def enemy
		@departments = Dep105.all.order(:dep_no)

		respond_to do |format|
			format.html
			format.json { render json: @departments }
		end
	end

	def enemy_submit
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
		@departments = Dep105.all.order(:dep_no)

		respond_to do |format|
			format.html
			format.json { render json: @departments }
		end
	end

	private

	def project_params
		params.require(:project).permit(:name, :description, :pixel_id)
	end

	def set_user_project
		@project = current_user.projects.find(params[:id])
	end
end
