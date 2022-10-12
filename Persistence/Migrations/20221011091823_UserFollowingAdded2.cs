using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class UserFollowingAdded2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserFollowing_AspNetUsers_ObserverId",
                table: "UserFollowing");

            migrationBuilder.DropForeignKey(
                name: "FK_UserFollowing_AspNetUsers_TargetId",
                table: "UserFollowing");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserFollowing",
                table: "UserFollowing");

            migrationBuilder.RenameTable(
                name: "UserFollowing",
                newName: "UserFollowings");

            migrationBuilder.RenameIndex(
                name: "IX_UserFollowing_TargetId",
                table: "UserFollowings",
                newName: "IX_UserFollowings_TargetId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserFollowings",
                table: "UserFollowings",
                columns: new[] { "ObserverId", "TargetId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserFollowings_AspNetUsers_ObserverId",
                table: "UserFollowings",
                column: "ObserverId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserFollowings_AspNetUsers_TargetId",
                table: "UserFollowings",
                column: "TargetId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserFollowings_AspNetUsers_ObserverId",
                table: "UserFollowings");

            migrationBuilder.DropForeignKey(
                name: "FK_UserFollowings_AspNetUsers_TargetId",
                table: "UserFollowings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserFollowings",
                table: "UserFollowings");

            migrationBuilder.RenameTable(
                name: "UserFollowings",
                newName: "UserFollowing");

            migrationBuilder.RenameIndex(
                name: "IX_UserFollowings_TargetId",
                table: "UserFollowing",
                newName: "IX_UserFollowing_TargetId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserFollowing",
                table: "UserFollowing",
                columns: new[] { "ObserverId", "TargetId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserFollowing_AspNetUsers_ObserverId",
                table: "UserFollowing",
                column: "ObserverId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserFollowing_AspNetUsers_TargetId",
                table: "UserFollowing",
                column: "TargetId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
