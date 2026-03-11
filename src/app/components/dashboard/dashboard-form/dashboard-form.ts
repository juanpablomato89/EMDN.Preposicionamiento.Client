import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Profile } from '../profile/profile';
import { Home } from '../home/home';
import { AuthService } from '../../../services/authservice';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { BasicUserResponse } from '../../../models/response/basicuserresponse';
import { BestNiches } from '../best-niches/best-niches';
import { ProductResearch } from "../product-research/product-research";
import { FavoriteProduct } from '../favorite-product/favorite-product';
import { Watchlist } from '../watchlist/watchlist';
import { HelpCenter } from '../help-center/help-center'

@Component({
  selector: 'app-dashboard-form',
  standalone: true,
  imports: [CommonModule, Profile, Home, BestNiches, ProductResearch, FavoriteProduct, Watchlist, HelpCenter],
  templateUrl: './dashboard-form.html',
  styleUrl: './dashboard-form.scss',
})
export class DashboardForm {
  isCollapsed = false;
  activeItem = 'home';
  user: BasicUserResponse = {};
  title = '';
  subtitle = 'Discover key insights on sales, trends, and market performance';
  isLoading = false;
  isLoadingUserValue = false;

  constructor(private authService: AuthService, private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getUserValue();
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  setActive(item: string) {
    this.activeItem = item;

    switch (item) {
      case 'home':
        this.title = `Welcome Back, ${this.user.name}`;
        this.subtitle =
          'Discover key insights on sales, trends, and market performance';
        break;
      case 'best':
        this.title = 'Best Niches';
        this.subtitle =
          'Uncover the most profitable niches and market opportunities.';
        break;
      case 'research':
        this.title = 'Product Research';
        this.subtitle = 'Find high-potential products to boost your sales.';
        break;
      case 'products':
        this.title = 'Favorite Products';
        this.subtitle = 'Manage and track your favorite products.';
        break;
      case 'favorites':
        this.title = 'Favorite Products';
        this.subtitle = 'Manage and track your favorite products.';
        break;
      case 'watchlist':
        this.title = 'Watchlist';
        this.subtitle = 'Manage and track your favorite products.';
        break;
      case 'settings':
        this.title = 'Settings';
        this.subtitle =
          'Customize Your Telescopy Experience. You are in Control';
        break;
      case 'help':
        this.title = 'Help Center';
        this.subtitle = 'Explore Support. Discover Better Ways Forward.';
        break;
      case 'contact':
        this.title = 'Contact us';
        this.subtitle = 'Contact us';
        break;

      default:
        break;
    }
  }

  logout() {
    this.isLoading = true;
    this.authService.logout();
  }

  getUserValue() {
    this.isLoadingUserValue = true;
    this.authService.getUserValue()
      .pipe(
        finalize(()=>{
          this.isLoadingUserValue = false
        })
      )
      .subscribe({
        next: (response) => {
          this.user = response.result;
          this.title = `Welcome Back, ${this.user.name}`;

      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error Uknown', 'Error');
      },
    });
  }
}
