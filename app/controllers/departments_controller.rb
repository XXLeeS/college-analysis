class DepartmentsController < ApplicationController
	before_action :set_year

	def index
		@departments = @dep.all.order(:dep_no)
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
		@departments = @dep.where('college_no = (?)', @college.college_no).order(:dep_no)

		@rscore_mean = @departments.map(&:ts_rscore).inject(0, &:+) / @departments.length
	end

	def show
		@department = @dep.find_by(dep_no: params[:id])

		rscores = @dep.pluck(:dep_no, :ts_rscore).sort!{|a,b| a[1] <=> b[1]}.reverse
		this_rank = rscores.index{|x| x[0] == @department.dep_no} + 1
		@percentage = (((rscores.length - this_rank) / rscores.length.to_f)*100).to_i
		puts rscores.length
		puts this_rank

		@adj_raw = @link.where('source = (?) OR target = (?)', @department.dep_no, @department.dep_no)
		@student_sum = @adj_raw.sum(:value)
		@adj_dep = @adj_raw.map{|r| @department.dep_no == r.source ? { :dep_no => r.target, :name => depNo_to_name(r.target), :value => r.value} : { :dep_no => r.source, :name => depNo_to_name(r.source), :value => r.value} }

		@win_rate = @winrate.where('dep = (?) AND total >= 5', @department.dep_no)
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
		@departments = @dep.all.order(:dep_no)

		respond_to do |format|
			format.html
			format.json { render json: @departments }
		end
	end

	def rank
		@fields = {
			0 => "全部領域",
			1 => "教育領域",
			2 => "人文及藝術領域",
			3 => "社會科學、商業及法律領域",
			4 => "科學領域",
			5 => "工程、製造及營造領域",
			6 => "農學領域",
			7 => "醫藥衛生及社福領域",
			8 => "服務領域",
			9 => "其他"
		}
		@this_field = params[:field].to_i
		if @this_field == 0
			@departments = @dep.all.order(:ts_rscore).reverse
		else
			@departments = @dep.where('field = (?)', params[:field]).order(:ts_rscore).reverse
		end
	end

	private

	def set_year
		@year = params[:year]
		@dep = Dep.where('year = (?)', @year)
		@winrate = Winrate.where('year = (?)', @year)
		@link = Link.where('year = (?)', @year)
	end

	def collegeNo_to_name(college_no)
		College.find(college_no).name
	end
	def depNo_to_name(dep_no)
		@dep.find_by(dep_no: dep_no).name
	end
end
