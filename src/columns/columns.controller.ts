import { Body, Controller, Param, Post, Put, Delete, Req, UseGuards, Patch } from '@nestjs/common';
import { ColumnsService } from './columns.service'; 
import { CreateColumnDto } from './dto/create-column.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';  
import { MoveColumnDto } from './dto/move-columns.dto';
 
@ApiBearerAuth() 
@UseGuards(JwtAuthGuard)
@ApiTags("Columns")
@Controller('projects/:projectId/columns')
export class ColumnsController {
  
  constructor(private columnsService: ColumnsService) { }
   
  @ApiOperation( { summary:"Create column" } ) 
  @Post()
  async createColumn(
    @Req() req, 
    @Param('projectId') projectId: number, 
    @Body() column: CreateColumnDto) {

    return this.columnsService.create(req.user, projectId, column);
  }

  @ApiOperation( { summary:"Update column" } ) 
  @Put(':columnId')
  async updateColumn(
    @Req() req, 
    @Param('projectId') projectId: number, 
    @Param('columnId') columnId: number, 
    @Body() updateColumnDto: CreateColumnDto) {

    return this.columnsService.update(req.user, projectId, columnId, updateColumnDto);
  }

  @ApiOperation( { summary:"Delete column" } ) 
  @Delete(':columnId')
  async removeColumn(
    @Req() req, 
    @Param('projectId') projectId: number, 
    @Param('columnId') columnId: number) {

    return this.columnsService.remove(req.user, projectId, columnId);
  } 

  @ApiOperation( { summary:"Move column" } )  
  @Patch(':columnId/move') 
  async moveColumn(
    @Req() req, 
    @Param('projectId') projectId: number, 
    @Param('columnId') columnId: number, 
    @Body() newOrder: MoveColumnDto ) {
      
    return this.columnsService.move(req.user, projectId, columnId, +newOrder.order);
  }
} 

