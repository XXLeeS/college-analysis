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

		@adj_raw = Link105.where('source = (?) OR target = (?)', @department.dep_no, @department.dep_no)
		@student_sum = @adj_raw.sum(:value)
		@adj_dep = @adj_raw.map{|r| @department.dep_no == r.source ? { :dep_no => r.target, :name => depNo_to_name(r.target), :value => r.value} : { :dep_no => r.source, :name => depNo_to_name(r.source), :value => r.value} }

		@win_rate = Winrate105.where('dep = (?) AND total >= 5', @department.dep_no)
		@win_rate = @win_rate.sort_by(&:total).reverse
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

	def rank
		@departments = Dep105.all.order(:dep_no)
	end

	private

	def collegeNo_to_name(college_no)
		College.find(college_no).name
	end
	def depNo_to_name(dep_no)
		Dep105.find(dep_no).name
	end
end
