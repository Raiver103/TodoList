import { Body, Controller, Get, Param, Post, Put, Req, Delete, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service'; 
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth() 
@UseGuards(JwtAuthGuard)
@ApiTags("Projects")
@Controller('projects') 
export class ProjectsController {
  
  constructor(private projectsService: ProjectsService) {}

  @ApiOperation( { summary:"Create project" } ) 
  @Post()
  create(
    @Req() req,
    @Body() createProjectDto: CreateProjectDto, 
  ) {
    return this.projectsService.create(req.user, createProjectDto );
  }

  @ApiOperation( { summary:"Get projects" } ) 
  @Get()
  getProjects(@Req() req) { 
    return this.projectsService.getAll(req.user); 
  }

  @ApiOperation( { summary:"Get project" } ) 
  @Get(':id')
  getProject(
    @Req() req,
    @Param('id') id: number, 
  ) {
    return this.projectsService.getOne(req.user, id);
  }

  @ApiOperation( { summary:"Update project" } ) 
  @Put(':id')
  updateProject(
    @Req() req,
    @Body() updateData: CreateProjectDto, 
    @Param('id') id: number, 
  ) {
    return this.projectsService.update(req.user, updateData, id);
  }

  @ApiOperation( { summary:"Delete project" } ) 
  @Delete(':id')
  removeProject(
    @Req() req,
    @Param('id') id: number 
  ) {
    return this.projectsService.remove(req.user, id);
  }
}
